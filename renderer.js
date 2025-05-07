function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    
    const toastHTML = document.createElement('div');
    toastHTML.className = `toast align-items-center text-bg-${type} border-0`;
    toastHTML.setAttribute('role', 'alert');
    toastHTML.setAttribute('aria-live', 'assertive');
    toastHTML.setAttribute('aria-atomic', 'true');
  
    toastHTML.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
  
    toastContainer.appendChild(toastHTML);
  
    const toast = new bootstrap.Toast(toastHTML);
    toast.show();
  
    // Auto-remove toast element after it's hidden
    toastHTML.addEventListener('hidden.bs.toast', () => {
      toastHTML.remove();
    });
  }
  
  function validateConfig(config) {
    if (!config.ip || !/^https?:\/\/.+/.test(config.ip)) {
      showToast("Invalid IP. Must start with http:// or https://", 'danger');
      return false;
    }
    if (!config.port || isNaN(config.port)) {
      showToast("Port must be a number", 'danger');
      return false;
    }
    return true;
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    window.electronAPI.getConfig();
  
    document.getElementById('submitButton').addEventListener('click', () => {
      const config = {
        ip: document.getElementById('ip').value.trim(),
        port: document.getElementById('port').value.trim(),
        printerName: document.getElementById('printerName').value.trim(),
        startup: document.getElementById('startup').checked ? "on" : "off",
        start: document.getElementById('start').checked ? "on" : "off",
        printBackground: document.getElementById('printBackground').checked ? "on" : "off"
      };
  
      if (!validateConfig(config)) return;
  
      window.electronAPI.setConfig(config);
      showToast("Configuration saved successfully");
    });
  
    document.getElementById('refreshConfigs').addEventListener('click', () => {
      window.electronAPI.getConfig();
      showToast("Configuration reloaded");
    });
  
    window.electronAPI.replyGetConfig((_, config) => {
      document.getElementById('ip').value = config.ip || 'http://';
      document.getElementById('port').value = config.port || '';
      document.getElementById('printerName').value = config.printerName || '';
      document.getElementById('startup').checked = config.startup === 'on';
      document.getElementById('start').checked = config.start === 'on';
      document.getElementById('printBackground').checked = config.printBackground === 'on';
    });
  
    window.electronAPI.updatePreviewFrame((_, url) => {
      document.getElementById('printPreview').src = url;
    });
  
    window.electronAPI.getVersion((_, version) => {
      document.getElementById('appVersion').textContent = `v${version}`;
    });
  });
  