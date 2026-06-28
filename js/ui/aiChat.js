// ─── AI CHAT ASSISTANT MODULE ──────────────────────────────────────────────

let chatHistory = [];
let isChatOpen = false;
let isSending = false;

// Suggestion questions the user can click
const suggestions = [
    "What's the current status of my system?",
    "How many permits are pending?",
    "Are there any disease outbreaks?",
    "What violations need attention?",
    "How many wastewater requests are critical?",
    "Show me recent activity"
];

export function toggleChat() {
    if (isChatOpen) {
        closeChat();
    } else {
        openChat();
    }
}

export function openChat() {
    isChatOpen = true;
    const existing = document.getElementById('ai-chat-panel');
    if (existing) {
        existing.classList.remove('translate-x-full', 'opacity-0');
        existing.classList.add('translate-x-0', 'opacity-100');
        return;
    }

    const panel = document.createElement('div');
    panel.id = 'ai-chat-panel';
    panel.className = 'ai-chat-panel fixed bottom-24 right-4 z-[65] w-80 sm:w-96 h-[500px] max-h-[70vh] rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl flex flex-col transform translate-x-full opacity-0 transition-all duration-300 ease-out';
    panel.innerHTML = `
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 shrink-0">
            <div class="flex items-center gap-2.5">
                <div class="relative w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-inner">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925-3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 2.25 12c0 1.257.625 2.368 1.583 3.033A3.743 3.743 0 0 0 3 15.75c0 .352.049.69.141 1.013A3.75 3.75 0 0 0 7.5 19.5h.75a3.75 3.75 0 0 0 3.75-3.75v-.75Z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 1-.495-7.467 5.99 5.99 0 0 1 1.925-3.546 5.974 5.974 0 0 0 2.133-1A3.75 3.75 0 0 1 21.75 12c0 1.257-.625 2.368-1.583 3.033A3.743 3.743 0 0 1 21 15.75c0 .352-.049.69-.141 1.013A3.75 3.75 0 0 1 16.5 19.5h-.75a3.75 3.75 0 0 1-3.75-3.75v-.75Z"/>
                    </svg>
                </div>
                <div>
                    <h4 class="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">AI Assistant</h4>
                    <p class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">● Online</p>
                </div>
            </div>
            <button id="ai-chat-close" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>

        <!-- Messages -->
        <div id="ai-chat-messages" class="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
            <div class="flex items-start gap-2.5 ai-msg-ai ">
                <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 mt-0.5 ml-2">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/>
                    </svg>
                </div>
                <div class="flex-1">
                    <div class="text-xs text-slate-700 dark:text-slate-200 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl rounded-tl-none px-3 py-2 border border-blue-500/10 dark:border-blue-500/20">
                        Hello! I'm your Municipal Health & Sanitation AI Assistant. Ask me anything about your system data.
                    </div>
                    <div class="flex flex-wrap gap-1.5 mt-2">
                        ${suggestions.slice(0, 3).map(s => `
                            <button class="ai-chat-suggestion text-[10px] px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-slate-200 dark:border-slate-600">${s}</button>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>

        <!-- Input -->
        <div class="px-3 py-3 border-t border-slate-200 dark:border-slate-700 shrink-0">
            <div class="flex items-center gap-2">
                <input id="ai-chat-input" type="text" placeholder="Ask about your system..." class="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:border-blue-400 transition-all placeholder:text-slate-400">
                <button id="ai-chat-send" class="shrink-0 w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white flex items-center justify-center transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(panel);

    // Force reflow for animation
    requestAnimationFrame(() => {
        panel.classList.remove('translate-x-full', 'opacity-0');
        panel.classList.add('translate-x-0', 'opacity-100');
    });

    // Event listeners
    document.getElementById('ai-chat-close').addEventListener('click', closeChat);
    document.getElementById('ai-chat-send').addEventListener('click', sendMessage);
    document.getElementById('ai-chat-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Suggestion clicks
    document.querySelectorAll('.ai-chat-suggestion').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById('ai-chat-input');
            if (input) {
                input.value = btn.textContent;
                sendMessage();
            }
        });
    });

    // Focus input
    setTimeout(() => document.getElementById('ai-chat-input')?.focus(), 300);
}

export function closeChat() {
    isChatOpen = false;
    const panel = document.getElementById('ai-chat-panel');
    if (panel) {
        panel.classList.remove('translate-x-0', 'opacity-100');
        panel.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (panel.parentNode) panel.parentNode.removeChild(panel);
        }, 300);
    }
}

async function sendMessage() {
    if (isSending) return;

    const input = document.getElementById('ai-chat-input');
    const messages = document.getElementById('ai-chat-messages');
    if (!input || !messages) return;

    const question = input.value.trim();
    if (!question) return;

    input.value = '';
    isSending = true;

    // Disable send button
    const sendBtn = document.getElementById('ai-chat-send');
    if (sendBtn) sendBtn.disabled = true;

    // Add user message
    appendMessage('user', question);
    chatHistory.push({ role: 'user', text: question });

    // Show typing indicator
    const typingId = showTypingIndicator(messages);

    try {
        const response = await fetch('api/ai/chat.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });

        // Remove typing indicator
        removeTypingIndicator(typingId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'success' && data.answer) {
            appendMessage('ai', data.answer);
            chatHistory.push({ role: 'ai', text: data.answer });
        } else {
            appendMessage('ai', "I'm sorry, I couldn't process that question. Please try again.");
        }
    } catch (e) {
        removeTypingIndicator(typingId);
        appendMessage('ai', "I'm having trouble connecting right now. Please try again in a moment.");
    } finally {
        isSending = false;
        if (sendBtn) sendBtn.disabled = false;
        input.focus();
    }
}

function appendMessage(role, text) {
    const messages = document.getElementById('ai-chat-messages');
    if (!messages) return;

    const div = document.createElement('div');
    div.className = `flex items-start gap-2.5 animate-fade-in ${role === 'user' ? 'flex-row-reverse' : ''}`;

    if (role === 'ai') {
        div.innerHTML = `
            <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/>
                </svg>
            </div>
            <div class="text-xs text-slate-700 dark:text-slate-200 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl rounded-tl-none px-3 py-2 border border-blue-500/10 dark:border-blue-500/20 max-w-[85%] leading-relaxed">${escapeHtml(text)}</div>
        `;
    } else {
        div.innerHTML = `
            <div class="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
                </svg>
            </div>
            <div class="text-xs text-white bg-blue-600 rounded-xl rounded-tr-none px-3 py-2 max-w-[85%] leading-relaxed">${escapeHtml(text)}</div>
        `;
    }

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function showTypingIndicator(container) {
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'flex items-start gap-2.5 animate-fade-in';
    div.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shrink-0 mt-0.5">
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"/>
            </svg>
        </div>
        <div class="flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 dark:border-blue-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-cyan-400 animate-bounce" style="animation-delay: 0s"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-cyan-400 animate-bounce" style="animation-delay: 0.15s"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-cyan-400 animate-bounce" style="animation-delay: 0.3s"></span>
        </div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}