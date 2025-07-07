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
        comment: "Authentication is now working with the provided credentials. Login, folder navigation, and folder selection work correctly. However, document creation fails with a 400 error (Request failed with status code 400). The API returns 'Empty names are not allowed.' The issue is in the file upload request where the path parameter is being sent correctly (Design\\TestDoc_1751912381.epr) but the API is still rejecting it."

metadata:
  created_by: "testing_agent"
  version: "1.0"
  test_sequence: 3

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
    message: "Authentication is now working with the provided credentials. The login, folder navigation, and folder selection functionality work correctly. However, document creation fails with a 400 error. The API returns 'Empty names are not allowed.' The issue appears to be in how the file upload request is being handled."
  - agent: "testing"
    message: "After further testing, I've identified that the document creation issue is related to the file upload API call. The path parameter is being correctly sent as 'Design\\TestDoc_1751912381.epr', but the API is still returning 'Empty names are not allowed.' This suggests there might be an issue with how the API is parsing the path or with the format of the path parameter. The issue could be in either the uploadNewDocumentViaProxy function in eos.js or in the proxy server's file upload endpoint."
```