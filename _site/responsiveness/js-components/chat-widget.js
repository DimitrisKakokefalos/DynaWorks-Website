// ==========================================
// DYNAWORKS CHAT WIDGET - Logic Only
// Works with agent.css
// ==========================================

(function() {
    'use strict';

    const CONFIG = {
        apiUrl: '/api/chat',
        errorMessage: 'Κάτι πήγε στραβά. Δοκίμασε ξανά ή στείλε email στο info@dynaworks.gr 📧',
        rateLimitMessage: 'Πολλά μηνύματα! Περίμενε λίγο και δοκίμασε ξανά. 🕐'
    };

    let widget, chatWindow, toggleBtn, closeBtn, messagesContainer, form, input, sendBtn, badge;
    let isOpen = false;
    let isProcessing = false;

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function toggle() {
        if (isOpen) {
            close();
        } else {
            open();
        }
    }

    function open() {
        isOpen = true;
        chatWindow.classList.add('active');
        if (badge) badge.style.display = 'none';
        setTimeout(() => input?.focus(), 300);
    }

    function close() {
        isOpen = false;
        chatWindow.classList.remove('active');
    }

    function addMessage(text, sender) {
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${escapeHtml(text)}</p>
            </div>
            <span class="message-time">${formatTime()}</span>
        `;
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    function showTyping() {
        if (!messagesContainer) return null;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot loading-msg';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
        return typingDiv;
    }

    function removeTyping(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    function scrollToBottom() {
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    function setProcessing(state) {
        isProcessing = state;
        if (input) input.disabled = state;
        if (sendBtn) sendBtn.disabled = state;
    }

    async function sendMessage() {
        const message = input?.value?.trim();
        if (!message || isProcessing) return;

        input.value = '';
        addMessage(message, 'user');

        setProcessing(true);
        const typingIndicator = showTyping();

        try {
            const response = await fetch(CONFIG.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            removeTyping(typingIndicator);

            if (!response.ok) {
                if (response.status === 429) {
                    addMessage(CONFIG.rateLimitMessage, 'bot');
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
                return;
            }

            const data = await response.json();
            const reply = data.reply || data.output || data.text || 'Έλαβα το μήνυμά σου!';
            addMessage(reply, 'bot');

        } catch (error) {
            console.error('Chat error:', error);
            removeTyping(typingIndicator);
            addMessage(CONFIG.errorMessage, 'bot');
        } finally {
            setProcessing(false);
            input?.focus();
        }
    }

    function bindEvents() {
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggle);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', close);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                close();
            }
        });

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                sendMessage();
            });
        }
    }

    function init() {
        widget = document.querySelector('.ai-chat-widget');
        if (!widget) {
            console.log('Chat widget HTML not found');
            return;
        }

        chatWindow = widget.querySelector('.chat-window') || document.getElementById('chatWindow');
        toggleBtn = widget.querySelector('.chat-toggle-btn') || document.getElementById('chatToggleBtn');
        closeBtn = widget.querySelector('.close-chat') || document.getElementById('closeChatBtn');
        messagesContainer = widget.querySelector('.chat-messages') || document.getElementById('chatMessages');
        form = widget.querySelector('#chatForm') || document.getElementById('chatForm');
        input = widget.querySelector('#chatInput') || document.getElementById('chatInput');
        sendBtn = form?.querySelector('.send-btn') || form?.querySelector('button[type="submit"]');
        badge = widget.querySelector('.notification-badge');

        bindEvents();

        console.log('💬 DynaWorks Chat Widget initialized (secure mode)');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();