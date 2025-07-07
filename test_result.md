```yaml
frontend:
  - task: "New Document Creation"
    implemented: true
    working: false
    file: "/app/src/views/Files.vue"
    stuck_count: 1
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Initial test setup for new document creation functionality"
      - working: false
        agent: "testing"
        comment: "Unable to test the new document creation functionality due to authentication issues. Login fails with 'Invalid user name or environment' when using test credentials."

metadata:
  created_by: "testing_agent"
  version: "1.0"
  test_sequence: 1

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
```