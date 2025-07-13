const pool = require('../config/db');
// const sftpService = require('./sftpService');
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
        
        const trades = [];
        
        await new Promise((resolve, reject) => {
            fs.createReadStream(tempFilePath)
                .pipe(csv({
                    skipLines: 0,
                    headers: [
                        'amend_id', 'timestamp', 'book', 'currency_pair', 
                        'side', 'quantity', 'price', 'margin_pips', 
                        'margin_bps', 'markup', 'market', 'dealt_ccy', 
                        'dealt_quantity', 'value_date', 'trade_details', 
                        'trade_date', 'trade_id', 'order_id', 'counterparty'
                    ]
                }))
                .on('data', (data) => {
                    trades.push(data);
                })
                .on('end', () => {
                    resolve();
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
        
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        let inserted = 0;
        let skipped = 0;
        
        for (const trade of trades) {
            const [existingTrade] = await connection.execute(
                'SELECT trade_id FROM trades WHERE trade_id = ?',
                [trade.trade_id]
            );
            
            if (existingTrade.length > 0) {
                skipped++;
                continue;
            }
            
            const price = parseFloat(trade.price) || null;
            const quantity = parseFloat(trade.quantity) || null;
            const marginPips = parseFloat(trade.margin_pips) || null;
            const marginBps = parseFloat(trade.margin_bps) || null;
            const dealtQuantity = parseFloat(trade.dealt_quantity) || null;
            
            await connection.execute(
                `INSERT INTO trades (
                    amend_id, timestamp, book, currency_pair, side, 
                    quantity, price, margin_pips, margin_bps, markup, 
                    market, dealt_ccy, dealt_quantity, value_date, 
                    trade_details, trade_date, trade_id, order_id, counterparty
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    trade.amend_id, 
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
        }
        
        await connection.commit();
        
        fs.unlinkSync(tempFilePath);
        
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
            sort_by = 'timestamp',
            sort_order = 'desc',
            date_from = '',
            date_to = ''
        } = req.query;
        
        // Ensure valid integers for pagination
        const validPage = Math.max(1, parseInt(page) || 1);
        const validLimit = Math.max(1, Math.min(100, parseInt(limit) || 10));
        const offset = (validPage - 1) * validLimit;
        
        connection = await pool.getConnection();
        
        let query = `
            SELECT 
                amend_id, timestamp, book, currency_pair, side, 
                quantity, price, margin_pips, margin_bps, markup, 
                market, dealt_ccy, dealt_quantity, value_date, 
                trade_details, trade_date, trade_id, order_id, counterparty
            FROM trades
            WHERE 1=1
        `;
        
        const queryParams = [];
        
        if (search) {
            query += ` AND (
                trade_id LIKE ? OR
                amend_id LIKE ? OR
                order_id LIKE ? OR
                book LIKE ? OR
                counterparty LIKE ?
            )`;
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
        }
        
        if (side) {
            query += ` AND side = ?`;
            queryParams.push(side);
        }
        
        if (book) {
            query += ` AND book = ?`;
            queryParams.push(book);
        }
        
        if (currency_pair) {
            query += ` AND currency_pair = ?`;
            queryParams.push(currency_pair);
        }
        
        if (counterparty) {
            query += ` AND counterparty = ?`;
            queryParams.push(counterparty);
        }
        
        if (date_from) {
            query += ` AND DATE(timestamp) >= ?`;
            queryParams.push(date_from);
        }
        
        if (date_to) {
            query += ` AND DATE(timestamp) <= ?`;
            queryParams.push(date_to);
        }
        
        const validSortColumns = [
            'amend_id', 'timestamp', 'book', 'currency_pair', 'side', 
            'quantity', 'price', 'margin_pips', 'margin_bps', 'markup', 
            'market', 'dealt_ccy', 'dealt_quantity', 'value_date', 
            'trade_details', 'trade_date', 'trade_id', 'order_id', 'counterparty'
        ];
        
        const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'timestamp';
        const sortDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        
        // Use string interpolation for LIMIT to avoid MAMP MySQL compatibility issues
        query += ` ORDER BY ${sortColumn} ${sortDir} LIMIT ${offset}, ${validLimit}`;
        
        const [tradeRows] = await connection.execute(query, queryParams);
        
        let countQuery = `
            SELECT COUNT(*) as total
            FROM trades
            WHERE 1=1
        `;
        
        const countParams = [];
        
        if (search) {
            countQuery += ` AND (
                trade_id LIKE ? OR
                amend_id LIKE ? OR
                order_id LIKE ? OR
                book LIKE ? OR
                counterparty LIKE ?
            )`;
            const searchTerm = `%${search}%`;
            countParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
        }
        
        if (side) {
            countQuery += ` AND side = ?`;
            countParams.push(side);
        }
        
        if (book) {
            countQuery += ` AND book = ?`;
            countParams.push(book);
        }
        
        if (currency_pair) {
            countQuery += ` AND currency_pair = ?`;
            countParams.push(currency_pair);
        }
        
        if (counterparty) {
            countQuery += ` AND counterparty = ?`;
            countParams.push(counterparty);
        }
        
        if (date_from) {
            countQuery += ` AND DATE(timestamp) >= ?`;
            countParams.push(date_from);
        }
        
        if (date_to) {
            countQuery += ` AND DATE(timestamp) <= ?`;
            countParams.push(date_to);
        }
        
        const [countResult] = await connection.execute(countQuery, countParams);
        const totalTrades = countResult[0].total;
        
        const [sideStats] = await connection.execute(
            `SELECT side, COUNT(*) as count
             FROM trades
             GROUP BY side`
        );
        
        const [currencyStats] = await connection.execute(
            `SELECT currency_pair, COUNT(*) as count
             FROM trades
             GROUP BY currency_pair`
        );
        
        const statistics = {
            total: totalTrades,
            buy: 0,
            sell: 0,
            currencies: {}
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
        
        res.json({
            success: true,
            data: {
                trades: tradeRows,
                pagination: {
                    page: validPage,
                    limit: validLimit,
                    total: totalTrades,
                    pages: Math.ceil(totalTrades / validLimit)
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
        
        const [tradeRows] = await connection.execute(
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
        
        const [bookRows] = await connection.execute(
            `SELECT DISTINCT book FROM trades WHERE book IS NOT NULL AND book != '' ORDER BY book`
        );
        
        const [currencyRows] = await connection.execute(
            `SELECT DISTINCT currency_pair FROM trades WHERE currency_pair IS NOT NULL AND currency_pair != '' ORDER BY currency_pair`
        );
        
        const [counterpartyRows] = await connection.execute(
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

module.exports = {
    uploadTradesCsv,
    getTrades,
    getTradeById,
    getTradeFilterOptions
};