/**
 * State Configuration Module
 * Loads state-config.json and applies state-specific values to the page
 */

let stateConfig = null;

async function loadStateConfig() {
    try {
        const response = await fetch('/state-config.json');
        if (!response.ok) {
            console.warn('No state-config.json found, using defaults');
            return getDefaultConfig();
        }
        stateConfig = await response.json();
        return stateConfig;
    } catch (e) {
        console.warn('Error loading state-config.json:', e);
        return getDefaultConfig();
    }
}

function getDefaultConfig() {
    return {
        state_code: 'XX',
        state_name: 'State',
        site_title: 'ICE Witness',
        site_description: 'Documenting ICE activity',
        contact_email: 'tips@us-ice-witness.org'
    };
}

function applyStateConfig(config) {
    // Update page title
    document.title = `${config.state_code} ICE Witness - ICE Incidents in ${config.state_name}`;

    // Update header
    const stateCodeEl = document.getElementById('state-code');
    if (stateCodeEl) stateCodeEl.textContent = config.state_code;

    const stateNameEl = document.getElementById('state-name');
    if (stateNameEl) stateNameEl.textContent = config.state_name;

    // Update footer email
    const footerEmail = document.getElementById('footer-email');
    if (footerEmail && config.contact_email) {
        footerEmail.href = `mailto:${config.contact_email}`;
    }

    // Update meta tags
    const metaDesc = document.getElementById('meta-description');
    if (metaDesc) {
        metaDesc.content = `Up-to-date sourced listing of ICE and CBP civil rights incidents in ${config.state_name}. Each incident includes multiple news sources.`;
    }

    // Update OG tags
    const ogTitle = document.getElementById('og-title');
    if (ogTitle) ogTitle.content = `${config.state_code} ICE Witness - ICE Incidents in ${config.state_name}`;

    const ogDesc = document.getElementById('og-description');
    if (ogDesc) ogDesc.content = config.site_description;

    // Set up state selector
    setupStateSelector(config);
}

function setupStateSelector(config) {
    const selector = document.getElementById('state-selector');
    if (!selector) return;

    // Highlight current state in dropdown
    const currentCode = config.state_code.toUpperCase();
    for (let option of selector.options) {
        if (option.textContent === currentCode) {
            option.disabled = true;
            option.textContent = `${currentCode} (current)`;
        }
    }

    // Handle state selection
    selector.addEventListener('change', function() {
        if (this.value) {
            window.location.href = this.value;
        }
        this.selectedIndex = 0; // Reset to "Other States"
    });
}

// Initialize on load
async function initStateConfig() {
    const config = await loadStateConfig();
    applyStateConfig(config);
    return config;
}

// Export for use in other modules
window.StateConfig = {
    init: initStateConfig,
    get: () => stateConfig,
    load: loadStateConfig
};
