import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { CodeEditorView } from './components/CodeEditorView';
import { TemplatesView } from './components/TemplatesView';
import { SettingsView } from './components/SettingsView';
import { ReleasesView } from './components/ReleasesView';
import { PromptLibraryModal } from './components/PromptLibraryModal';
import { NewAppModal } from './components/NewAppModal';
import { INITIAL_APPS } from './data/mockApps';
import {
  DyadApp,
  ViewTab,
  ChatMode,
  ProviderConfig,
  ChatMessage,
  AgentStep,
  FileDiff,
} from './types';

export default function App() {
  // Persistence state
  const [apps, setApps] = useState<DyadApp[]>(() => {
    try {
      const saved = localStorage.getItem('dyad_apps');
      return saved ? JSON.parse(saved) : INITIAL_APPS;
    } catch {
      return INITIAL_APPS;
    }
  });

  const [currentAppId, setCurrentAppId] = useState<string>(() => {
    return apps[0]?.id || 'app-analytics';
  });

  const [activeTab, setActiveTab] = useState<ViewTab>('studio');
  const [activeMode, setActiveMode] = useState<ChatMode>('agent');
  const [selectedModelId, setSelectedModelId] = useState<string>('claude-3-7-sonnet');
  const [isGenerating, setIsGenerating] = useState(false);

  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false);
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);

  const [providerConfig, setProviderConfig] = useState<ProviderConfig>(() => {
    try {
      const saved = localStorage.getItem('dyad_config');
      return saved
        ? JSON.parse(saved)
        : {
            anthropicKey: '',
            openaiKey: '',
            geminiKey: '',
            ollamaHost: 'http://localhost:11434',
            defaultMode: 'agent',
            defaultModel: 'claude-3-7-sonnet',
            autoApproveTools: true,
            theme: 'dark',
            releaseChannel: 'stable',
          };
    } catch {
      return {
        anthropicKey: '',
        openaiKey: '',
        geminiKey: '',
        ollamaHost: 'http://localhost:11434',
        defaultMode: 'agent',
        defaultModel: 'claude-3-7-sonnet',
        autoApproveTools: true,
        theme: 'dark',
        releaseChannel: 'stable',
      };
    }
  });

  // Save apps on change
  useEffect(() => {
    try {
      localStorage.setItem('dyad_apps', JSON.stringify(apps));
    } catch (e) {
      console.error('Failed saving to localStorage', e);
    }
  }, [apps]);

  // Save config on change
  useEffect(() => {
    try {
      localStorage.setItem('dyad_config', JSON.stringify(providerConfig));
    } catch (e) {
      console.error('Failed saving config', e);
    }
  }, [providerConfig]);

  const currentApp = apps.find((a) => a.id === currentAppId) || apps[0];

  const handleSendMessage = (text: string, mode: ChatMode, modelId: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode,
      modelId,
    };

    const updatedApp = {
      ...currentApp,
      chatHistory: [...currentApp.chatHistory, userMsg],
    };

    setApps(apps.map((a) => (a.id === currentApp.id ? updatedApp : a)));
    setIsGenerating(true);

    // Simulate Agent execution with realistic tools and diffs
    setTimeout(() => {
      let assistantContent = '';
      let steps: AgentStep[] = [];
      let diffs: FileDiff[] = [];

      if (mode === 'ask') {
        assistantContent = `In the current "${currentApp.name}" architecture, the main layout is composed in \`src/App.tsx\` using React 19 functional hooks. State flows down through modular components, and styles leverage Tailwind utility classes. The runtime is Vite with zero-config hot module replacement.`;
      } else if (mode === 'plan') {
        assistantContent = `### Implementation Plan for: "${text}"\n\n1. **Component Scaffolding**: Create a modular subcomponent under \`src/components/\`.\n2. **State Management**: Introduce local state with persistent fallback in \`localStorage\`.\n3. **Event Listeners**: Bind interactive click and change handlers.\n4. **Accessibility & Polish**: Apply high-contrast WCAG AA compliant colors and smooth entry transitions.`;
      } else {
        // Agent or Build mode: make code edits
        assistantContent = `I have analyzed the request and implemented the updates for "${currentApp.name}". The changes have been compiled, verified with TypeScript strict typecheck (0 errors), and the live preview has been synchronized.`;
        steps = [
          {
            id: `s-${Date.now()}-1`,
            type: 'read_file',
            title: 'Inspecting src/App.tsx',
            detail: 'Read existing component tree and hook dependencies',
            status: 'completed',
            timestamp: new Date().toLocaleTimeString(),
          },
          {
            id: `s-${Date.now()}-2`,
            type: 'edit_file',
            title: 'Applying modifications to src/App.tsx',
            detail: `Added feature handlers matching prompt: "${text.slice(0, 45)}..."`,
            status: 'completed',
            timestamp: new Date().toLocaleTimeString(),
          },
          {
            id: `s-${Date.now()}-3`,
            type: 'typecheck',
            title: 'Running TypeScript check (tsgo)',
            detail: 'Verified strict type safety with 0 errors across files',
            status: 'completed',
            timestamp: new Date().toLocaleTimeString(),
          },
        ];

        diffs = [
          {
            path: 'src/App.tsx',
            oldContent: '// previous render tree',
            newContent: `// Added interactive enhancement: ${text.slice(0, 35)}...`,
            additions: 18,
            deletions: 3,
          },
        ];
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode,
        modelId,
        steps: steps.length > 0 ? steps : undefined,
        diffs: diffs.length > 0 ? diffs : undefined,
        isApplied: true,
      };

      const finalApp = {
        ...updatedApp,
        chatHistory: [...updatedApp.chatHistory, assistantMsg],
      };

      setApps(apps.map((a) => (a.id === currentApp.id ? finalApp : a)));
      setIsGenerating(false);
    }, 1200);
  };

  const handleUpdateFile = (path: string, newContent: string) => {
    const updatedFiles = currentApp.files.map((f) =>
      f.path === path ? { ...f, content: newContent, isModified: true } : f
    );
    const updatedApp = { ...currentApp, files: updatedFiles, updatedAt: 'Just now' };
    setApps(apps.map((a) => (a.id === currentApp.id ? updatedApp : a)));
  };

  const handleAddFile = (path: string, content: string) => {
    const fileName = path.split('/').pop() || path;
    const newFile = {
      path,
      name: fileName,
      content,
      language: path.endsWith('.json') ? 'json' : 'typescript',
    };
    const updatedApp = {
      ...currentApp,
      files: [...currentApp.files, newFile],
      updatedAt: 'Just now',
    };
    setApps(apps.map((a) => (a.id === currentApp.id ? updatedApp : a)));
  };

  const handleAcceptDiffs = (messageId: string) => {
    const updatedHistory = currentApp.chatHistory.map((m) =>
      m.id === messageId ? { ...m, isApplied: true } : m
    );
    const updatedApp = { ...currentApp, chatHistory: updatedHistory };
    setApps(apps.map((a) => (a.id === currentApp.id ? updatedApp : a)));
  };

  const handleRevertDiffs = (messageId: string) => {
    const updatedHistory = currentApp.chatHistory.map((m) =>
      m.id === messageId ? { ...m, isApplied: false } : m
    );
    const updatedApp = { ...currentApp, chatHistory: updatedHistory };
    setApps(apps.map((a) => (a.id === currentApp.id ? updatedApp : a)));
  };

  const handleCreateApp = (name: string, description: string, appType: 'react-vite' | 'nextjs') => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newApp: DyadApp = {
      id: `app-${Date.now()}`,
      name,
      slug,
      description: description || 'Built with Dyad local app builder',
      category: 'Custom',
      icon: 'Boxes',
      updatedAt: 'Just now',
      appType,
      previewComponent: 'CustomPreview',
      files: [
        {
          path: 'src/App.tsx',
          name: 'App.tsx',
          language: 'typescript',
          content: `import React from 'react';\n\nexport default function App() {\n  return (\n    <div className="min-h-screen bg-neutral-950 text-white p-8">\n      <h1 className="text-2xl font-bold">${name}</h1>\n      <p className="text-neutral-400 mt-2">${description || 'Start building by asking Dyad in chat!'}</p>\n    </div>\n  );\n}`,
        },
        {
          path: 'package.json',
          name: 'package.json',
          language: 'json',
          content: `{\n  "name": "${slug}",\n  "private": true,\n  "version": "0.1.0"\n}`,
        },
      ],
      chatHistory: [],
    };

    setApps([newApp, ...apps]);
    setCurrentAppId(newApp.id);
    setActiveTab('studio');
  };

  const handleExportApp = () => {
    const projectPayload = {
      name: currentApp.name,
      slug: currentApp.slug,
      exportedAt: new Date().toISOString(),
      files: currentApp.files,
    };
    const blob = new Blob([JSON.stringify(projectPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentApp.slug}-dyad-project.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0c0d0e] text-neutral-100 font-sans select-none">
      {/* Top Application Header */}
      <Header
        currentApp={currentApp}
        apps={apps}
        onSelectApp={(app) => {
          setCurrentAppId(app.id);
          setActiveTab('studio');
        }}
        onNewApp={() => setIsNewAppModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onExportApp={handleExportApp}
      />

      {/* Main Tab Views */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'studio' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left 45%: Chat and Agent Tools */}
            <div className="w-[45%] h-full">
              <ChatPanel
                currentApp={currentApp}
                onSendMessage={handleSendMessage}
                onOpenPromptLibrary={() => setIsPromptLibraryOpen(true)}
                isGenerating={isGenerating}
                activeMode={activeMode}
                onChangeMode={setActiveMode}
                selectedModelId={selectedModelId}
                onSelectModel={setSelectedModelId}
                onAcceptDiffs={handleAcceptDiffs}
                onRevertDiffs={handleRevertDiffs}
              />
            </div>

            {/* Right 55%: Live Preview Sandbox */}
            <div className="w-[55%] h-full">
              <PreviewPanel currentApp={currentApp} />
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <CodeEditorView
            currentApp={currentApp}
            onUpdateFile={handleUpdateFile}
            onAddFile={handleAddFile}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesView
            apps={apps}
            onSelectTemplate={(app) => {
              setCurrentAppId(app.id);
              setActiveTab('studio');
            }}
          />
        )}

        {activeTab === 'releases' && <ReleasesView />}

        {activeTab === 'settings' && (
          <SettingsView config={providerConfig} onSaveConfig={setProviderConfig} />
        )}
      </div>

      {/* Modals */}
      <PromptLibraryModal
        isOpen={isPromptLibraryOpen}
        onClose={() => setIsPromptLibraryOpen(false)}
        onSelectPrompt={(p) => handleSendMessage(p, activeMode, selectedModelId)}
      />

      <NewAppModal
        isOpen={isNewAppModalOpen}
        onClose={() => setIsNewAppModalOpen(false)}
        onCreateApp={handleCreateApp}
      />
    </div>
  );
}
