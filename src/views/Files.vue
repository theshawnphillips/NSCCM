.new-btn:hover {
  background: #00b6e3;
  color: #fff;
}

<template>
  <div>
    <div style="display: flex; align-items: center; justify-content: flex-start; margin-bottom: 1rem;">
      <button class="logout-btn" @click="logoutAndReturn" title="Logout">Logout</button>
    </div>
    <p class="instruction-message">Edit your document templates online. Browse the folder structure below to locate your template, then click on the file name to open and begin editing.</p>
    <div class="files-explorer-layout">
      <div class="explorer-tree">
        <div class="folders-header">
          <h3>Folders</h3>
          <button class="refresh-icon-btn" @click="showAndRunApiCall" title="Refresh">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4.93 4.93a7 7 0 1 1-1.41 2.36" stroke="#005580" stroke-width="2" fill="none"/><polyline points="4 9 2 7 4 5" stroke="#005580" stroke-width="2" fill="none"/></svg>
          </button>
        </div>
        <FileTree v-if="tree.length" :nodes="tree" :onSelectFolder="selectFolder" :selectedPath="selectedFolderPath" />
        <div v-else>No folders found.</div>
      </div>
      <div class="explorer-files">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem;">
          <h3 style="margin: 0;">Files</h3>
          <button 
            v-if="selectedFolderPath" 
            class="new-btn" 
            @click="onNewClick"
            title="Create New Document">
            + New Document
          </button>
        </div>
        <div v-if="selectedFiles.length">
          <ul class="file-list">
            <li v-for="file in selectedFiles" :key="file.Path">
              <a v-if="file.Path.toLowerCase().endsWith('.epr')"
                 :href="getEprLink(file)"
                 target="_blank" rel="noopener noreferrer">
                📄 {{ file.Path.split('\\').slice(-1)[0] }}
              </a>
              <span v-else>📄 {{ file.Path.split('\\').slice(-1)[0] }}</span>
            </li>
          </ul>
        </div>
        <div v-else class="no-files">No files in this folder.</div>
        
        <!-- New Document Modal -->
        <div v-if="showNewDocumentModal" class="modal-overlay" @click="closeModal">
          <div class="modal-content" @click.stop>
            <h3>Create New Document</h3>
            <p>Enter a name for your new document:</p>
            <input 
              v-model="newDocumentName" 
              type="text" 
              placeholder="Document name"
              class="new-document-input"
              @keyup.enter="createNewDocument"
              @keyup.escape="closeModal"
              ref="newDocumentInput"
            />
            <div class="modal-actions">
              <button class="cancel-btn" @click="closeModal">Cancel</button>
              <button class="create-btn" @click="createNewDocument" :disabled="!newDocumentName.trim() || isUploading">
                {{ isUploading ? 'Creating...' : 'Create' }}
              </button>
            </div>
            <div v-if="uploadError" class="error">{{ uploadError }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, defineComponent, h, reactive, onMounted } from 'vue'
import eos from '../api/eos'

import { nextTick } from 'vue'

// New file name input logic
const showNewInput = ref(false)
const newFileName = ref('')
const newFileInput = ref(null)

function onNewClick() {
  newFileName.value = ''
  showNewInput.value = true
  nextTick(() => {
    if (newFileInput.value) newFileInput.value.focus()
  })
}

function submitNewFileName() {
  if (newFileName.value.trim()) {
    // Replace this alert with your upload/modal logic as needed
    alert('New file name: ' + newFileName.value.trim())
  }
  showNewInput.value = false
  newFileName.value = ''
}

function cancelNewFileName() {
  showNewInput.value = false
  newFileName.value = ''
}

import { useRouter } from 'vue-router'

const items = ref([])
const error = ref('')
const token = ref('')
const tree = ref([])
const selectedFolderPath = ref('')
const selectedFiles = ref([])

const router = useRouter()

function logoutAndReturn() {
  localStorage.removeItem('eosToken')
  router.push('/')
}

function prefillToken() {
  const stored = localStorage.getItem('eosToken')
  if (stored) token.value = stored
}

onMounted(() => {
  prefillToken()
  showAndRunApiCall()
})

function buildTree(flatItems) {
  const root = {}
  for (const item of flatItems) {
    const parts = item.Path.split('\\')
    let node = root
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      if (!node[part]) {
        node[part] = {
          __children: {},
          __isFolder: i < parts.length - 1 || item.Type === 'folder',
          __item: i === parts.length - 1 ? item : null,
          __fullPath: parts.slice(0, i + 1).join('\\')
        }
      }
      node = node[part].__children
    }
  }
  function toArray(node, name = '') {
    return Object.entries(node).map(([key, value]) => {
      const children = toArray(value.__children, key)
      return {
        name: key,
        isFolder: value.__isFolder,
        item: value.__item,
        children,
        fullPath: value.__fullPath
      }
    })
  }
  return toArray(root)
}

const EPR_BASE_URL = 'https://engagecxdemo-enterprise.mhccom.net/EOS/EprEditor?environment=Demo&returnUrl=%2FEOS%2FFiles%3Fenvironment%3DDemo%26returnUrl%3Dhttps%253A%252F%252Fengagecxdemo-enterprise.mhccom.net%252FEOS%252FWorkspaces%253Fenvironment%253DDemo%2526cloudInstance%253Dhttps%25253a%25252f%25252fengagecxdemo-enterprise.mhccom.net%2523workspace%23workspace%2FDefault%2FCats%2520and%2520Dogs%2520Vet%2520Services';

function getEprLink(item) {
  if (!item || !item.Path || !item.Workspace) return '#';
  const filePath = encodeURIComponent(item.Path.replace(/\\/g, '\\'));
  const workspace = encodeURIComponent(item.Workspace);
  const hash = `#workspace/${workspace}/${encodeURIComponent(item.Path.replace(/\\/g, '/'))}`;
  return `${EPR_BASE_URL}&filePath=${filePath}&workspace=${workspace}${hash}`;
}

async function showAndRunApiCall() {
  error.value = ''
  items.value = []
  tree.value = []
  selectedFiles.value = []
  selectedFolderPath.value = ''
  const workspace = 'Default'
  const path = '\\' // Use double backslash for root
  prefillToken()
  if (!token.value) {
    error.value = 'Session token required. Please log in first.'
    return
  }
  let flat
  try {
    flat = await eos.getFilesAndFoldersViaProxy({ token: token.value, workspace, path })
  } catch (e) {
    error.value = 'Failed to load files.'
    console.error('Files error:', e)
    return
  }
  items.value = flat
  tree.value = buildTree(flat)
}

function selectFolder(path) {
  selectedFolderPath.value = path
  // Find files in the selected folder
  const files = items.value.filter(item => {
    const folderPath = item.Path.split('\\').slice(0, -1).join('\\')
    return item.Type === 'file' && folderPath === path
  })
  selectedFiles.value = files
}

const FileTree = defineComponent({
  name: 'FileTree',
  props: {
    nodes: {
      type: Array,
      required: true
    },
    onSelectFolder: {
      type: Function,
      required: true
    },
    selectedPath: {
      type: String,
      required: false
    }
  },
  setup(props) {
    const expanded = reactive(new Set())
    // Automatically expand the 'Design' top-level folder
    onMounted(() => {
      if (props.nodes && props.nodes.length) {
        const designNode = props.nodes.find(n => n.name === 'Design')
        if (designNode) {
          expanded.add(designNode.fullPath)
        }
      }
    })
    function toggle(path) {
      if (expanded.has(path)) expanded.delete(path)
      else expanded.add(path)
    }
    function render(nodes, parentPath = '') {
      return h('ul',
        nodes.map(node => {
          const fullPath = node.fullPath
          if (node.isFolder) {
            const isOpen = expanded.has(fullPath)
            const isSelected = props.selectedPath === fullPath
            return h('li', [
              h('span', {
                style: `cursor:pointer;user-select:none;${isSelected ? 'background:#e6f7ff;color:#005580;border-radius:4px;padding:2px 6px;' : ''}`,
                onClick: () => {
                  toggle(fullPath)
                  props.onSelectFolder(fullPath)
                }
              }, [isOpen ? '▼ ' : '▶ ', h('strong', node.name)]),
              isOpen && node.children && node.children.length > 0
                ? render(node.children, fullPath)
                : null
            ])
          }
          return null
        })
      )
    }
    return () => render(props.nodes)
  }
})
</script>

<style scoped>
.instruction-message {
  text-align: center;
  color: #505050;
  font-size: 1.1rem;
  line-height: 1.5;
  max-width: 800px;
  margin: 0 auto 2rem auto;
  padding: 0 1rem;
  font-family: 'Segoe UI', 'Arial', sans-serif;
}
.show-btn {
  background: #005580;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  margin: 2rem auto 1rem auto;
  display: block;
  cursor: pointer;
  transition: background 0.2s;
}

.show-btn:hover {
  background: #00b6e3;
  color: #fff;
}

.new-btn:hover {
  background: #00b6e3;
  color: #fff;
}

.new-file-input {
  outline: none;
  box-shadow: 0 0 0 2px #e6f7ff;
  transition: box-shadow 0.2s;
}
.files-explorer-layout {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  max-width: 900px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.07);
  border: 1px solid #e6e6e6;
  font-family: 'Segoe UI', 'Arial', sans-serif;
  min-height: 500px;
}
.explorer-tree {
  flex: 1 1 250px;
  border-right: 1px solid #e6e6e6;
  padding: 2rem 1.5rem 2rem 2rem;
  min-width: 220px;
  text-align: left;
  align-items: flex-start;
}
.explorer-tree ul,
.explorer-tree ul ul {
  list-style: none !important;
  padding-left: 1rem;
  margin-left: 0;
}
.explorer-tree li {
  list-style-type: none !important;
  margin: 0.25rem 0;
  font-size: 1.08rem;
  text-align: left;
  color: #222;
  padding-left: 0;
}
.explorer-files {
  flex: 2.4 1 0; /* was 2 1 0, now 20% wider */
  padding: 2rem 2rem 2rem 1.5rem;
}
.file-list {
  list-style: none;
  padding-left: 0;
}
.file-list li {
  font-size: 1.08rem;
  margin: 0.5rem 0;
  color: #222;
  display: flex;
  align-items: center;
}
.file-list a {
  color: #005580;
  text-decoration: underline;
  font-weight: 500;
  transition: color 0.2s;
}
.file-list a:hover {
  color: #00b6e3;
}
.no-files {
  color: #888;
  font-style: italic;
  margin-top: 1rem;
}
.error {
  color: #d32f2f;
  background: #fff0f0;
  border: 1px solid #ffd6d6;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-weight: 500;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
.folders-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.folders-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #005580;
}
.refresh-icon-btn {
  background: none;
  border: none;
  padding: 0 0.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 1.5rem;
  transition: background 0.2s;
}
.refresh-icon-btn:hover svg path,
.refresh-icon-btn:hover svg polyline {
  stroke: #00b6e3;
}
.refresh-icon-btn svg {
  display: block;
}


.logout-btn {
  background: #fff;
  color: #005580;
  border: 1px solid #005580;
  border-radius: 6px;
  padding: 0.4rem 1.1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-right: 1rem;
  transition: background 0.2s, color 0.2s, border 0.2s;
}
.logout-btn:hover {
  background: #005580;
  color: #fff;
}

.new-btn {
  background: #005580;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.35rem 1.1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.new-btn:hover {
  background: #00b6e3;
  color: #fff;
}
</style>
