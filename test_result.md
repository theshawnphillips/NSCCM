```yaml
frontend:
  - task: "New Document Creation"
    implemented: true
    working: false
    file: "/app/src/views/Files.vue"
    stuck_count: 2
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial test setup for new document creation functionality"
      - working: false
        agent: "testing"
        comment: "Unable to test the new document creation functionality due to authentication issues. Login fails with 'Invalid user name or environment' when using test credentials."
      - working: false
        agent: "testing"
        comment: "Authentication is now working with the provided credentials. Login, folder navigation, and folder selection work correctly. However, document creation fails with a 400 error (Request failed with status code 400). The proxy server logs show 'Upload proxy error: { Message: 'Empty names are not allowed.' }' which suggests an issue with the path parameter in the API call."

metadata:
  created_by: "testing_agent"
  version: "1.0"
  test_sequence: 2

test_plan:
  current_focus:
    - "New Document Creation"
  stuck_tasks:
    - "New Document Creation"
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "testing"
    message: "Setting up testing for new document creation functionality"
  - agent: "testing"
    message: "Authentication is failing with the test credentials. The proxy server returns 'Invalid user name or environment' error. Need valid credentials to test the new document creation functionality."
  - agent: "testing"
    message: "Authentication is now working with the provided credentials. The login, folder navigation, and folder selection functionality work correctly. However, document creation fails with a 400 error. The proxy server logs show 'Upload proxy error: { Message: 'Empty names are not allowed.' }' which suggests an issue with the path parameter in the API call. The issue appears to be in the uploadNewDocumentViaProxy function in eos.js or in the proxy server's file upload endpoint. The path parameter might be incorrectly formatted or empty when sent to the API."
```