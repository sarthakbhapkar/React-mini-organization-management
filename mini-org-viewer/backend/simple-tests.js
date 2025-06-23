const http = require('http');
const assert = require('assert');

// Configuration
const BASE_URL = 'http://localhost:3000';
let authToken = '';

// Simple HTTP request helper
function makeRequest(method, path, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(url, options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    resolve({ status: res.statusCode, data: response });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

// Test helper functions
function log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
}

function success(testName) {
    console.log(`✅ ${testName} - PASSED`);
}

function fail(testName, error) {
    console.log(`❌ ${testName} - FAILED: ${error}`);
    process.exitCode = 1;
}

// Wait for server to be ready
async function waitForServer() {
    log('Waiting for server to be ready...');
    let attempts = 0;
    while (attempts < 10) {
        try {
            const response = await makeRequest('GET', '/health');
            if (response.status === 200) {
                log('Server is ready!');
                return;
            }
        } catch (e) {
            // Server not ready yet
        }
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    throw new Error('Server did not start in time');
}

// Test functions
async function testHealthCheck() {
    try {
        const response = await makeRequest('GET', '/health');
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.success, true);
        success('Health Check');
    } catch (error) {
        fail('Health Check', error.message);
    }
}

async function testRootEndpoint() {
    try {
        const response = await makeRequest('GET', '/');
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.success, true);
        assert(response.data.endpoints);
        success('Root Endpoint');
    } catch (error) {
        fail('Root Endpoint', error.message);
    }
}

async function testLoginAsAdmin() {
    try {
        const response = await makeRequest('POST', '/api/auth/login', {
            email: 'admin@company.com',
            password: 'admin123'
        });
        
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.success, true);
        assert(response.data.data.token);
        assert.strictEqual(response.data.data.user.role, 'ADMIN');
        
        // Store token for subsequent tests
        authToken = response.data.data.token;
        success('Login as Admin');
    } catch (error) {
        fail('Login as Admin', error.message);
    }
}

async function testLoginWithWrongCredentials() {
    try {
        const response = await makeRequest('POST', '/api/auth/login', {
            email: 'admin@company.com',
            password: 'wrongpassword'
        });
        
        assert.strictEqual(response.status, 401);
        assert.strictEqual(response.data.success, false);
        assert.strictEqual(response.data.error.code, 'INVALID_CREDENTIALS');
        success('Login with Wrong Credentials');
    } catch (error) {
        fail('Login with Wrong Credentials', error.message);
    }
}

async function testAuthMe() {
    try {
        const response = await makeRequest('GET', '/api/auth/me', null, {
            'Authorization': `Bearer ${authToken}`
        });
        
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.success, true);
        assert.strictEqual(response.data.data.email, 'admin@company.com');
        success('Auth Me');
    } catch (error) {
        fail('Auth Me', error.message);
    }
}

async function testAuthMeWithoutToken() {
    try {
        const response = await makeRequest('GET', '/api/auth/me');
        
        assert.strictEqual(response.status, 401);
        assert.strictEqual(response.data.success, false);
        success('Auth Me Without Token');
    } catch (error) {
        fail('Auth Me Without Token', error.message);
    }
}

async function testFetchTeams() {
    try {
        const response = await makeRequest('GET', '/api/teams', null, {
            'Authorization': `Bearer ${authToken}`
        });
        
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.success, true);
        assert(Array.isArray(response.data.data));
        success('Fetch Teams');
    } catch (error) {
        fail('Fetch Teams', error.message);
    }
}

async function testCreateUser() {
    try {
        const response = await makeRequest('POST', '/api/users', {
            email: 'jane.smith@company.com',
            name: 'Test User',
            password: 'testpass123',
            role: 'MEMBER'
        }, {
            'Authorization': `Bearer ${authToken}`
        });
        
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.success, true);
        assert.strictEqual(response.data.data.email, 'jane.smith@company.com');
        assert.strictEqual(response.data.data.role, 'MEMBER');
        success('Create User');
    } catch (error) {
        fail('Create User', error.message);
    }
}

async function testCreateDuplicateUser() {
    try {
        const response = await makeRequest('POST', '/api/users', {
            email: 'jane.smith@company.com', // Same email as above
            name: 'Another Test User',
            password: 'testpass123',
            role: 'MEMBER'
        }, {
            'Authorization': `Bearer ${authToken}`
        });
        
        assert.strictEqual(response.status, 400);
        assert.strictEqual(response.data.success, false);
        assert.strictEqual(response.data.error.code, 'DUPLICATE_EMAIL');
        success('Create Duplicate User');
    } catch (error) {
        fail('Create Duplicate User', error.message);
    }
}

async function testFetchUsers() {
    try {
        const response = await makeRequest('GET', '/api/users', null, {
            'Authorization': `Bearer ${authToken}`
        });
        
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.success, true);
        assert(Array.isArray(response.data.data));
        assert(response.data.data.length >= 2); // Admin + test user
        assert(response.data.pagination);
        success('Fetch Users');
    } catch (error) {
        fail('Fetch Users', error.message);
    }
}

async function testCreateTeam() {
    try {
        // First get a user to make team lead
        const usersResponse = await makeRequest('GET', '/api/users', null, {
            'Authorization': `Bearer ${authToken}`
        });
        
        const testUser = usersResponse.data.data.find(u => u.email === 'jane.smith@company.com');
        assert(testUser, 'Test user should exist');
        
        const response = await makeRequest('POST', '/api/teams', {
            name: 'Engineering Team',
            description: 'Software development team',
            team_lead_id: testUser.id
        }, {
            'Authorization': `Bearer ${authToken}`
        });
        
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.success, true);
        assert.strictEqual(response.data.data.name, 'Engineering Team');
        assert.strictEqual(response.data.data.team_lead_id, testUser.id);
        success('Create Team');
    } catch (error) {
        fail('Create Team', error.message);
    }
}

async function testFetchTeamsAfterCreation() {
    try {
        const response = await makeRequest('GET', '/api/teams', null, {
            'Authorization': `Bearer ${authToken}`
        });
        
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.success, true);
        assert(response.data.data.length >= 1);
        
        const team = response.data.data.find(t => t.name === 'Engineering Team');
        assert(team, 'Engineering Team should exist');
        success('Fetch Teams After Creation');
    } catch (error) {
        fail('Fetch Teams After Creation', error.message);
    }
}

async function testFetchTeamMembers() {
    try {
        // Get the team first
        const teamsResponse = await makeRequest('GET', '/api/teams', null, {
            'Authorization': `Bearer ${authToken}`
        });
        
        const team = teamsResponse.data.data.find(t => t.name === 'Engineering Team');
        assert(team, 'Engineering Team should exist');
        
        const response = await makeRequest('GET', `/api/teams/${team.id}/members`, null, {
            'Authorization': `Bearer ${authToken}`
        });
        
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.success, true);
        assert(response.data.data.team);
        assert(Array.isArray(response.data.data.members));
        success('Fetch Team Members');
    } catch (error) {
        fail('Fetch Team Members', error.message);
    }
}

async function testCreateMoreUsers() {
    try {
        // Create users for a binary tree hierarchy structure
        // Level 0: 1 team lead
        // Level 1: 2 members reporting to team lead  
        // Level 2: 4 members (2 reporting to each level 1 member)
        const users = [
            // Level 1 - Direct reports to team lead
            {
                email: 'john.doe@company.com',
                name: 'John Doe',
                password: 'password123',
                role: 'MEMBER'
            },
            {
                email: 'charlie.davis@company.com',
                name: 'Charlie Davis',
                password: 'password123',
                role: 'MEMBER'
            },
            // Level 2 - Reports to John Doe
            {
                email: 'bob.wilson@company.com',
                name: 'Bob Wilson',
                password: 'password123',
                role: 'MEMBER'
            },
            {
                email: 'alice.brown@company.com',
                name: 'Alice Brown',
                password: 'password123',
                role: 'MEMBER'
            },
            // Level 2 - Reports to Charlie Davis
            {
                email: 'diana.miller@company.com',
                name: 'Diana Miller',
                password: 'password123',
                role: 'MEMBER'
            },
            {
                email: 'mike.johnson@company.com',
                name: 'Mike Johnson',
                password: 'password123',
                role: 'MEMBER'
            }
        ];

        for (const user of users) {
            const response = await makeRequest('POST', '/api/users', user, {
                'Authorization': `Bearer ${authToken}`
            });
            
            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.data.success, true);
            assert.strictEqual(response.data.data.email, user.email);
            assert.strictEqual(response.data.data.role, user.role);
            log(`Created user: ${user.name}`);
        }
        
        success('Create More Users');
    } catch (error) {
        fail('Create More Users', error.message);
    }
}

async function testAssignUsersToTeam() {
    try {
        // Get the Engineering Team
        const teamsResponse = await makeRequest('GET', '/api/teams', null, {
            'Authorization': `Bearer ${authToken}`
        });
        
        const engineeringTeam = teamsResponse.data.data.find(t => t.name === 'Engineering Team');
        assert(engineeringTeam, 'Engineering Team should exist');
        
        // Get all users to build the hierarchy
        const usersResponse = await makeRequest('GET', '/api/users', null, {
            'Authorization': `Bearer ${authToken}`
        });
        
        const users = usersResponse.data.data;
        
        // Find key users for the hierarchy
        const janeSmith = users.find(u => u.email === 'jane.smith@company.com'); // Team lead (already assigned)
        const johnDoe = users.find(u => u.email === 'john.doe@company.com');
        const charlieDavis = users.find(u => u.email === 'charlie.davis@company.com');
        const bobWilson = users.find(u => u.email === 'bob.wilson@company.com');
        const aliceBrown = users.find(u => u.email === 'alice.brown@company.com');
        const dianaMiller = users.find(u => u.email === 'diana.miller@company.com');
        const mikeJohnson = users.find(u => u.email === 'mike.johnson@company.com');
        
        assert(janeSmith, 'Jane Smith should exist');
        assert(johnDoe, 'John Doe should exist');
        assert(charlieDavis, 'Charlie Davis should exist');
        assert(bobWilson, 'Bob Wilson should exist');
        assert(aliceBrown, 'Alice Brown should exist');
        assert(dianaMiller, 'Diana Miller should exist');
        assert(mikeJohnson, 'Mike Johnson should exist');
        
        let successfulAssignments = 0;
        
        // Level 1: Assign direct reports to Jane Smith (team lead)
        log('Assigning Level 1 users (direct reports to team lead)...');
        const level1Users = [
            { user: johnDoe, reportsTo: janeSmith },
            { user: charlieDavis, reportsTo: janeSmith }
        ];
        
        for (const { user, reportsTo } of level1Users) {
            const response = await makeRequest('POST', `/api/teams/${engineeringTeam.id}/members`, {
                user_id: user.id,
                reports_to: reportsTo.id
            }, {
                'Authorization': `Bearer ${authToken}`
            });
            
            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.data.success, true);
            log(`Successfully added ${user.name} reporting to ${reportsTo.name}`);
            successfulAssignments++;
        }
        
        // Level 2: Assign users who report to Level 1 users
        log('Assigning Level 2 users...');
        const level2Users = [
            { user: bobWilson, reportsTo: johnDoe },
            { user: aliceBrown, reportsTo: johnDoe },
            { user: dianaMiller, reportsTo: charlieDavis },
            { user: mikeJohnson, reportsTo: charlieDavis }
        ];
        
        for (const { user, reportsTo } of level2Users) {
            const response = await makeRequest('POST', `/api/teams/${engineeringTeam.id}/members`, {
                user_id: user.id,
                reports_to: reportsTo.id
            }, {
                'Authorization': `Bearer ${authToken}`
            });
            
            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.data.success, true);
            log(`Successfully added ${user.name} reporting to ${reportsTo.name}`);
            successfulAssignments++;
        }
        
        const expectedAssignments = level1Users.length + level2Users.length;
        assert.strictEqual(successfulAssignments, expectedAssignments, 'All users should be assigned to the team');
        
        // Verify team members count by fetching team members
        const membersResponse = await makeRequest('GET', `/api/teams/${engineeringTeam.id}/members`, null, {
            'Authorization': `Bearer ${authToken}`
        });
        
        assert.strictEqual(membersResponse.status, 200);
        assert.strictEqual(membersResponse.data.success, true);
        
        log(`Team now has ${membersResponse.data.data.members.length} members total`);
        log('Final hierarchy structure:');
        log(`- ${janeSmith.name} (Team Lead)`);
        log(`  - ${johnDoe.name}`);
        log(`    - ${bobWilson.name}`);
        log(`    - ${aliceBrown.name}`);
        log(`  - ${charlieDavis.name}`);
        log(`    - ${dianaMiller.name}`);
        log(`    - ${mikeJohnson.name}`);
        
        success('Assign Users to Team');
    } catch (error) {
        fail('Assign Users to Team', error.message);
    }
}

async function testFetchOrganizationHierarchy() {
    try {
        const response = await makeRequest('GET', '/api/org/hierarchy', null, {
            'Authorization': `Bearer ${authToken}`
        });

        console.log(JSON.stringify(response, null, 2));
        
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.success, true);
        assert(response.data.data.organization);
        assert(Array.isArray(response.data.data.hierarchy));
        success('Fetch Organization Hierarchy');
    } catch (error) {
        fail('Fetch Organization Hierarchy', error.message);
    }
}

async function testLeavePolicies() {
    try {
        const response = await makeRequest('GET', '/api/leave/policies', null, {
            'Authorization': `Bearer ${authToken}`
        });
        
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.success, true);
        success('Fetch Leave Policies');
    } catch (error) {
        fail('Fetch Leave Policies', error.message);
    }
}

async function testCreateLeavePolicy() {
    try {
        const response = await makeRequest('PUT', '/api/leave/policies', {
            sick_leave: 10,
            casual_leave: 15,
            work_from_home: 52
        }, {
            'Authorization': `Bearer ${authToken}`
        });
        
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.success, true);
        assert.strictEqual(response.data.data.sick_leave, 10);
        assert.strictEqual(response.data.data.casual_leave, 15);
        success('Create Leave Policy');
    } catch (error) {
        fail('Create Leave Policy', error.message);
    }
}

async function testCreateLeaveRequest() {
    try {
        const response = await makeRequest('POST', '/api/leave/requests', {
            leave_type: 'CASUAL',
            start_date: '2024-03-01',
            end_date: '2024-03-02',
            reason: 'Personal work'
        }, {
            'Authorization': `Bearer ${authToken}`
        });
        
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.success, true);
        assert.strictEqual(response.data.data.leave_type, 'CASUAL');
        assert.strictEqual(response.data.data.status, 'PENDING');
        success('Create Leave Request');
    } catch (error) {
        fail('Create Leave Request', error.message);
    }
}

async function testFetchLeaveRequests() {
    try {
        const response = await makeRequest('GET', '/api/leave/requests', null, {
            'Authorization': `Bearer ${authToken}`
        });
        
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.data.success, true);
        assert(Array.isArray(response.data.data));
        success('Fetch Leave Requests');
    } catch (error) {
        fail('Fetch Leave Requests', error.message);
    }
}

async function testUnauthorizedAccess() {
    try {
        const response = await makeRequest('GET', '/api/users');
        
        assert.strictEqual(response.status, 401);
        assert.strictEqual(response.data.success, false);
        success('Unauthorized Access');
    } catch (error) {
        fail('Unauthorized Access', error.message);
    }
}

async function testNotFoundEndpoint() {
    try {
        const response = await makeRequest('GET', '/api/nonexistent');
        
        assert.strictEqual(response.status, 404);
        assert.strictEqual(response.data.success, false);
        success('Not Found Endpoint');
    } catch (error) {
        fail('Not Found Endpoint', error.message);
    }
}

// Main test runner
async function runAllTests() {
    console.log('🚀 Starting Simple API Tests...\n');
    
    try {
        // Wait for server
        await waitForServer();
        
        // Basic tests
        await testHealthCheck();
        await testRootEndpoint();
        
        // Authentication tests
        await testLoginAsAdmin();
        await testLoginWithWrongCredentials();
        await testAuthMe();
        await testAuthMeWithoutToken();
        
        // User management tests
        await testCreateUser();
        await testCreateDuplicateUser();
        await testFetchUsers();
        
        // Team management tests  
        await testFetchTeams();
        await testCreateTeam();
        await testFetchTeamsAfterCreation();
        await testFetchTeamMembers();
        
        // Create more test data
        await testCreateMoreUsers();
        await testAssignUsersToTeam();
        
        // Organization tests
        await testFetchOrganizationHierarchy();
        
        // Leave management tests
        await testLeavePolicies();
        await testCreateLeavePolicy();
        await testCreateLeaveRequest();
        await testFetchLeaveRequests();
        
        // Security tests
        await testUnauthorizedAccess();
        await testNotFoundEndpoint();
        
        console.log('\n🎉 All tests completed!');
        if (process.exitCode !== 1) {
            console.log('✅ All tests PASSED!');
        } else {
            console.log('❌ Some tests FAILED!');
        }
        
    } catch (error) {
        console.error('❌ Test suite failed:', error.message);
        process.exitCode = 1;
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests();
}

module.exports = { runAllTests }; 