const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);
const { Readable } = require('stream');

const uploadTradesCsv = async (req, res, next) => {
    let connection;
    const tempFilePath = path.join(__dirname, '../temp', `upload_${Date.now()}.csv`);
    
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }
        
        if (!fs.existsSync(path.join(__dirname, '../temp'))) {
            fs.mkdirSync(path.join(__dirname, '../temp'), { recursive: true });
        }
        
        fs.writeFileSync(tempFilePath, req.file.buffer);
        
        console.log('File saved, starting CSV parsing...');
        const trades = [];
        let totalRowsProcessed = 0;
        let headerRowsSkipped = 0;
        let invalidRowsSkipped = 0;
        
        await new Promise((resolve, reject) => {
            fs.createReadStream(tempFilePath)
                .pipe(csv({
                    // Let CSV parser auto-detect headers from first line
                    // Don't skip lines here, we'll filter in the data handler
                }))
                .on('data', (data) => {
                    totalRowsProcessed++;
                    console.log(`Processing row ${totalRowsProcessed}:`, data);
                    console.log('Available columns:', Object.keys(data));
                    
                    // Check if this looks like a header row
                    const firstColumnValue = Object.values(data)[0] || '';
                    const isHeaderRow = firstColumnValue && (
                        firstColumnValue.toString().toLowerCase().includes('amend') ||
                        firstColumnValue.toString().toLowerCase().includes('id') ||
                        firstColumnValue.toString().toLowerCase().includes('timestamp') ||
                        firstColumnValue.toString().toLowerCase().includes('trade')
                    );
                    
                    if (isHeaderRow) {
                        headerRowsSkipped++;
                        console.log(`Skipping header row ${headerRowsSkipped}:`, data);
                        return;
                    }
                    
                    // Map the data to our expected format using exact CSV column names
                    const mappedTrade = {
                        amend_id: null, // Don't store amend_id since it's empty in the CSV
                        timestamp: data['Timestamp'] || '',
                        book: data['Book'] || '',
                        currency_pair: data['Currency Pair'] || '',
                        side: data['Side (Base CCY)'] || '', // Note the exact column name with parentheses
                        quantity: data['Quantity'] || '',
                        price: data['Price'] || '',
                        margin_pips: data['Margin Pips'] || '',
                        margin_bps: data['Margin Bps'] || '',
                        markup: data['Markup'] || '',
                        market: data['Market'] || '',
                        dealt_ccy: data['Dealt CCY'] || '',
                        dealt_quantity: data['Dealt Quantity'] || '',
                        value_date: data['Value Date'] || '',
                        trade_details: data['Trade Details'] || '',
                        trade_date: data['Trade Date'] || '',
                        trade_id: data['Trade ID'] || '',
                        order_id: data['Order ID'] || '',
                        counterparty: data['Counterparty'] || ''
                    };
                    
                    console.log('Mapped trade:', mappedTrade);
                    
                    // Only check for trade_id since that's what the user has
                    if (mappedTrade.trade_id && mappedTrade.trade_id.trim() !== '') {
                        console.log(`Adding trade with trade_id: ${mappedTrade.trade_id} (total trades so far: ${trades.length + 1})`);
                        trades.push(mappedTrade);
                    } else {
                        invalidRowsSkipped++;
                        console.log(`Skipping row ${totalRowsProcessed} - no valid trade_id found. Raw data:`, data);
                    }
                })
                .on('end', () => {
                    console.log(`CSV parsing complete!`);
                    console.log(`- Total rows processed: ${totalRowsProcessed}`);
                    console.log(`- Header rows skipped: ${headerRowsSkipped}`);
                    console.log(`- Invalid rows skipped: ${invalidRowsSkipped}`);
                    console.log(`- Valid trades found: ${trades.length}`);
                    resolve();
                })
                .on('error', (error) => {
                    console.error('CSV parsing error:', error);
                    reject(error);
                });
        });
        
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        let inserted = 0;
        let skipped = 0;
        
        console.log(`Starting database insertion for ${trades.length} trades...`);
        
        for (const trade of trades) {
            console.log(`Processing trade ${inserted + skipped + 1}/${trades.length}: ${trade.trade_id}`);
            
            const [existingTrade] = await connection.query(
                'SELECT trade_id FROM trades WHERE trade_id = ?',
                [trade.trade_id]
            );
            
            if (existingTrade.length > 0) {
                skipped++;
                console.log(`Skipped duplicate trade_id: ${trade.trade_id} (${skipped} total skipped)`);
                continue;
            }
            
            const price = parseFloat(trade.price) || null;
            const quantity = parseFloat(trade.quantity) || null;
            const marginPips = parseFloat(trade.margin_pips) || null;
            const marginBps = parseFloat(trade.margin_bps) || null;
            const dealtQuantity = parseFloat(trade.dealt_quantity) || null;
            
            await connection.query(
                `INSERT INTO trades (
                    amend_id, timestamp, book, currency_pair, side, 
                    quantity, price, margin_pips, margin_bps, markup, 
                    market, dealt_ccy, dealt_quantity, value_date, 
                    trade_details, trade_date, trade_id, order_id, counterparty
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    null, // Always null for amend_id since it's empty in CSV
                    trade.timestamp || null, 
                    trade.book, 
                    trade.currency_pair,
                    trade.side,
                    quantity,
                    price,
                    marginPips,
                    marginBps,
                    trade.markup,
                    trade.market,
                    trade.dealt_ccy,
                    dealtQuantity,
                    trade.value_date,
                    trade.trade_details,
                    trade.trade_date,
                    trade.trade_id,
                    trade.order_id,
                    trade.counterparty
                ]
            );
            
            inserted++;
            console.log(`Inserted trade: ${trade.trade_id} (${inserted} total inserted)`);
        }
        
        await connection.commit();
        
        fs.unlinkSync(tempFilePath);
        
        console.log(`Upload complete! Final count: ${inserted} trades inserted, ${skipped} skipped`);
        
        res.json({
            success: true,
            data: {
                inserted,
                skipped,
                total: trades.length
            },
            message: `Successfully processed ${trades.length} trades. Inserted: ${inserted}, Skipped: ${skipped}`
        });
        
    } catch (error) {
        console.error('Error uploading trades CSV:', error);
        
        if (connection) {
            await connection.rollback();
        }
        
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
        
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const getTrades = async (req, res, next) => {
    let connection;
    try {
        const { 
            search = '',
            side = '', 
            book = '',
            currency_pair = '',
            counterparty = '',
            page = 1, 
            limit = 10,
            sort_by = 'created_at',
            sort_order = 'desc',
            date_from = '',
            date_to = '',
            min_quantity = '',
            max_quantity = '',
            min_price = '',
            max_price = ''
        } = req.query;
        
        // Input validation and sanitization
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
        const offset = (pageNum - 1) * limitNum;
        const searchTerm = search ? search.toString().trim() : '';
        
        connection = await pool.getConnection();
        
        // Build WHERE conditions dynamically
        let whereConditions = [];
        let queryParams = [];
        
        if (searchTerm) {
            whereConditions.push(`(
                trade_id LIKE ? OR
                amend_id LIKE ? OR
                order_id LIKE ? OR
                book LIKE ? OR
                counterparty LIKE ? OR
                currency_pair LIKE ?
            )`);
            const searchPattern = `%${searchTerm}%`;
            queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
        }
        
        if (side) {
            whereConditions.push(`side = ?`);
            queryParams.push(side.toString());
        }
        
        if (book) {
            whereConditions.push(`book = ?`);
            queryParams.push(book.toString());
        }
        
        if (currency_pair) {
            whereConditions.push(`currency_pair = ?`);
            queryParams.push(currency_pair.toString());
        }
        
        if (counterparty) {
            whereConditions.push(`counterparty = ?`);
            queryParams.push(counterparty.toString());
        }
        
        if (date_from) {
            whereConditions.push(`DATE(created_at) >= ?`);
            queryParams.push(date_from.toString());
        }
        
        if (date_to) {
            whereConditions.push(`DATE(created_at) <= ?`);
            queryParams.push(date_to.toString());
        }
        
        if (min_quantity) {
            whereConditions.push(`quantity >= ?`);
            queryParams.push(parseFloat(min_quantity));
        }
        
        if (max_quantity) {
            whereConditions.push(`quantity <= ?`);
            queryParams.push(parseFloat(max_quantity));
        }
        
        if (min_price) {
            whereConditions.push(`price >= ?`);
            queryParams.push(parseFloat(min_price));
        }
        
        if (max_price) {
            whereConditions.push(`price <= ?`);
            queryParams.push(parseFloat(max_price));
        }
        
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        
        // Validate sort parameters
        const validSortColumns = [
            'amend_id', 'created_at', 'book', 'currency_pair', 'side', 
            'quantity', 'price', 'margin_pips', 'margin_bps', 'markup', 
            'market', 'dealt_ccy', 'dealt_quantity', 'value_date', 
            'trade_details', 'trade_date', 'trade_id', 'order_id', 'counterparty', 'timestamp'
        ];
        
        const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'created_at';
        const sortDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        
        // Main query
        const mainQuery = `
            SELECT 
                amend_id, timestamp, book, currency_pair, side, 
                quantity, price, margin_pips, margin_bps, markup, 
                market, dealt_ccy, dealt_quantity, value_date, 
                trade_details, trade_date, trade_id, order_id, counterparty, created_at
            FROM trades
            ${whereClause}
            ORDER BY ${sortColumn} ${sortDir}
            LIMIT ? OFFSET ?
        `;
        
        const mainQueryParams = [...queryParams, limitNum, offset];
        const [tradeRows] = await connection.query(mainQuery, mainQueryParams);
        
        // Count query (same WHERE conditions but no LIMIT/OFFSET)
        const countQuery = `
            SELECT COUNT(*) as total
            FROM trades
            ${whereClause}
        `;
        
        const [countResult] = await connection.query(countQuery, queryParams);
        const totalTrades = countResult[0].total;
        
        // Get statistics
        const [sideStats] = await connection.query(
            `SELECT side, COUNT(*) as count
             FROM trades
             GROUP BY side`
        );
        
        const [currencyStats] = await connection.query(
            `SELECT currency_pair, COUNT(*) as count
             FROM trades
             GROUP BY currency_pair
             ORDER BY count DESC
             LIMIT 10`
        );
        
        const [bookStats] = await connection.query(
            `SELECT book, COUNT(*) as count
             FROM trades
             WHERE book IS NOT NULL
             GROUP BY book
             ORDER BY count DESC
             LIMIT 10`
        );
        
        const [volumeStats] = await connection.query(
            `SELECT 
                SUM(quantity) as total_quantity,
                AVG(price) as avg_price,
                MIN(price) as min_price,
                MAX(price) as max_price
             FROM trades
             WHERE quantity IS NOT NULL AND price IS NOT NULL`
        );
        
        const statistics = {
            total: totalTrades,
            buy: 0,
            sell: 0,
            currencies: {},
            books: {},
            volume: {
                total_quantity: volumeStats[0]?.total_quantity || 0,
                avg_price: volumeStats[0]?.avg_price || 0,
                min_price: volumeStats[0]?.min_price || 0,
                max_price: volumeStats[0]?.max_price || 0
            }
        };
        
        sideStats.forEach(row => {
            if (row.side?.toLowerCase() === 'buy') {
                statistics.buy = row.count;
            } else if (row.side?.toLowerCase() === 'sell') {
                statistics.sell = row.count;
            }
        });
        
        currencyStats.forEach(row => {
            if (row.currency_pair) {
                statistics.currencies[row.currency_pair] = row.count;
            }
        });
        
        bookStats.forEach(row => {
            if (row.book) {
                statistics.books[row.book] = row.count;
            }
        });
        
        res.json({
            success: true,
            data: {
                trades: tradeRows,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: totalTrades,
                    pages: Math.ceil(totalTrades / limitNum)
                },
                statistics
            }
        });
        
    } catch (error) {
        console.error('Error fetching trades:', error);
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const getTradeById = async (req, res, next) => {
    let connection;
    try {
        const tradeId = req.params.tradeId;
        
        if (!tradeId) {
            return res.status(400).json({
                success: false,
                message: 'Trade ID is required'
            });
        }
        
        connection = await pool.getConnection();
        
        const [tradeRows] = await connection.query(
            `SELECT 
                amend_id, timestamp, book, currency_pair, side, 
                quantity, price, margin_pips, margin_bps, markup, 
                market, dealt_ccy, dealt_quantity, value_date, 
                trade_details, trade_date, trade_id, order_id, counterparty
             FROM trades
             WHERE trade_id = ?`,
            [tradeId]
        );
        
        if (tradeRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Trade not found'
            });
        }
        
        res.json({
            success: true,
            data: tradeRows[0]
        });
        
    } catch (error) {
        console.error('Error fetching trade details:', error);
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const getTradeFilterOptions = async (req, res, next) => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const [bookRows] = await connection.query(
            `SELECT DISTINCT book FROM trades WHERE book IS NOT NULL AND book != '' ORDER BY book`
        );
        
        const [currencyRows] = await connection.query(
            `SELECT DISTINCT currency_pair FROM trades WHERE currency_pair IS NOT NULL AND currency_pair != '' ORDER BY currency_pair`
        );
        
        const [counterpartyRows] = await connection.query(
            `SELECT DISTINCT counterparty FROM trades WHERE counterparty IS NOT NULL AND counterparty != '' ORDER BY counterparty`
        );
        
        res.json({
            success: true,
            data: {
                books: bookRows.map(row => row.book),
                currencies: currencyRows.map(row => row.currency_pair),
                counterparties: counterpartyRows.map(row => row.counterparty)
            }
        });
        
    } catch (error) {
        console.error('Error fetching filter options:', error);
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const cleanupHeaderRows = async (req, res, next) => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const [deletedRows] = await connection.query(`
            DELETE FROM trades WHERE 
                amend_id LIKE '%amend%' OR 
                amend_id LIKE '%id%' OR
                timestamp LIKE '%timestamp%' OR
                book LIKE '%book%' OR
                currency_pair LIKE '%currency%' OR
                currency_pair LIKE '%pair%' OR
                side LIKE '%side%' OR
                side LIKE '%base%' OR
                quantity LIKE '%quantity%' OR
                price LIKE '%price%' OR
                counterparty LIKE '%counterparty%' OR
                trade_id LIKE '%trade%'
        `);
        
        res.json({
            success: true,
            data: {
                deleted: deletedRows.affectedRows
            },
            message: `Successfully cleaned up ${deletedRows.affectedRows} header rows from database`
        });
        
    } catch (error) {
        console.error('Error cleaning up header rows:', error);
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

module.exports = {
    uploadTradesCsv,
    getTrades,
    getTradeById,
    getTradeFilterOptions,
    cleanupHeaderRows
};