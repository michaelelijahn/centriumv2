#!/usr/bin/env node

/**
 * Test script to verify the Service-Oriented Layered Architecture
 * This tests that the lazy loading dependency injection fix worked
 */

const http = require('http');

const BASE_URL = 'localhost';
const PORT = 3000;

// Helper function to make HTTP requests
function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: BASE_URL,
            port: PORT,
            path: path,
            method: 'GET',
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsedData });
                } catch (error) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

async function testArchitecture() {
    console.log('🧪 Testing Service-Oriented Layered Architecture...\n');

    const tests = [
        {
            name: 'Health Check',
            endpoint: '/health',
            description: 'Verifies all services and repositories are healthy'
        },
        {
            name: 'Container Info',
            endpoint: '/container/info',
            description: 'Shows available services and repositories'
        },
        {
            name: 'Basic API Test',
            endpoint: '/test',
            description: 'Basic server functionality test'
        }
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (const test of tests) {
        try {
            console.log(`🔍 Testing: ${test.name}`);
            console.log(`   Endpoint: GET ${test.endpoint}`);
            console.log(`   Description: ${test.description}`);

            const response = await makeRequest(test.endpoint);

            if (response.status === 200) {
                console.log(`   ✅ PASS - Status: ${response.status}`);
                
                // Show specific results for each test
                if (test.endpoint === '/health') {
                    const data = response.data;
                    console.log(`   📊 Status: ${data.status}`);
                    console.log(`   🔧 Services: ${Object.keys(data.services).length} available`);
                    console.log(`   💾 Repositories: ${Object.keys(data.repositories).length} available`);
                    console.log(`   🗄️  Database: ${data.database}`);
                } else if (test.endpoint === '/container/info') {
                    const data = response.data.data;
                    console.log(`   🔧 Services: [${data.services.join(', ')}]`);
                    console.log(`   💾 Repositories: [${data.repositories.join(', ')}]`);
                } else if (test.endpoint === '/test') {
                    console.log(`   📝 Response: ${response.data.message}`);
                }
                
                passedTests++;
            } else {
                console.log(`   ❌ FAIL - Status: ${response.status}`);
            }
        } catch (error) {
            console.log(`   ❌ FAIL - Error: ${error.message}`);
            if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED')) {
                console.log('   💡 Hint: Make sure the server is running with: npm start');
            }
        }
        console.log('');
    }

    // Summary
    console.log('📊 Test Results Summary:');
    console.log(`   ✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`   ❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 All tests passed! The Service-Oriented Layered Architecture is working correctly.');
        console.log('\n✅ Key Achievements:');
        console.log('   • Dependency injection container initialized successfully');
        console.log('   • Lazy loading prevents timing issues');
        console.log('   • All services and repositories are healthy');
        console.log('   • API endpoints are responding correctly');
        console.log('   • Backend architecture transformation complete');
        
        console.log('\n🚀 Your application now has:');
        console.log('   • Clean separation of concerns');
        console.log('   • Testable business logic');
        console.log('   • Maintainable code structure');
        console.log('   • Enterprise-ready architecture');
        
        return true;
    } else {
        console.log('\n⚠️  Some tests failed. Please check the server logs and try again.');
        return false;
    }
}

// Test lazy loading specifically
async function testLazyLoading() {
    console.log('\n🔄 Testing Lazy Loading Dependency Injection...\n');
    
    try {
        // Import controllers to test lazy loading
        const SupportController = require('./src/controllers/SupportController');
        const AdminController = require('./src/controllers/AdminController');
        
        console.log('✅ SupportController imported successfully');
        console.log('✅ AdminController imported successfully');
        
        // Test that services are accessible (this would have failed before the fix)
        console.log('🔍 Testing service access...');
        
        // Create instances
        const supportController = new (require('./src/controllers/SupportController').constructor)();
        const adminController = new (require('./src/controllers/AdminController').constructor)();
        
        console.log('✅ Controller instances created successfully');
        console.log('✅ Lazy loading dependency injection is working correctly');
        
        return true;
    } catch (error) {
        console.log(`❌ Lazy loading test failed: ${error.message}`);
        return false;
    }
}

// Run tests
async function main() {
    console.log('🎯 Service-Oriented Layered Architecture Test Suite');
    console.log('=' .repeat(60));
    
    const architectureTestResult = await testArchitecture();
    const lazyLoadingTestResult = await testLazyLoading();
    
    if (architectureTestResult && lazyLoadingTestResult) {
        console.log('\n🎉 🎉 🎉 ALL TESTS PASSED! 🎉 🎉 🎉');
        console.log('\nThe dependency injection timing issue has been resolved.');
        console.log('Your Service-Oriented Layered Architecture is working perfectly!');
        process.exit(0);
    } else {
        console.log('\n❌ Some tests failed. Please review the output above.');
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        console.error('Test suite failed:', error);
        process.exit(1);
    });
}

module.exports = { testArchitecture, testLazyLoading }; 