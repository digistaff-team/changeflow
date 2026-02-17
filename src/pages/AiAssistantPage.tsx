import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useAppStore } from '@/stores/app-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User } from 'lucide-react';
import type { AiConversation } from '@/types';

const botResponses = [
  'Для успешного внедрения изменений рекомендую начать с формирования коалиции лидеров. Это ключевой шаг по модели Коттера.',
  'Сопротивление — естественная часть процесса изменений. Важно работать с причинами, а не с симптомами.',
  'Рекомендую провести картирование потока создания ценности (VSM) перед началом оптимизации.',
  'При цифровой трансформации критично сначала оптимизировать процессы, а затем автоматизировать их.',
  'Для оценки культурных изменений используйте модель Камерона-Куинна (OCAI). Это поможет определить текущий и целевой профиль.',
  'Ключ к успеху — регулярная коммуникация. Создайте ритуал еженедельных обновлений о ходе программы изменений.',
];

export default function AiAssistantPage() {
  const { user } = useAuthStore();
  const { aiConversations, addAiMessage } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatId = 'main';
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = aiConversations.filter(m => m.chat_id === chatId);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: AiConversation = {
      id: 'msg' + Date.now(),
      user_id: user?.id || 'u1',
      chat_id: chatId,
      message_role: 'user',
      message_content: input.trim(),
      created_at: new Date().toISOString(),
    };
    addAiMessage(userMsg);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = botResponses[Math.floor(Math.random() * botResponses.length)];
      addAiMessage({
        id: 'msg' + (Date.now() + 1),
        user_id: user?.id || 'u1',
        chat_id: chatId,
        message_role: 'assistant',
        message_content: response,
        created_at: new Date().toISOString(),
      });
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="p-6 h-[calc(100vh-0px)] flex flex-col max-w-3xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground">AI-ассистент</h1>
        <p className="text-muted-foreground text-sm">Консультант по управлению изменениями</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Bot className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Задайте вопрос об управлении изменениями</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {['Как преодолеть сопротивление?', 'С чего начать Lean?', 'Метрики для трансформации'].map(q => (
                    <Button key={q} variant="outline" size="sm" className="text-xs" onClick={() => { setInput(q); }}>
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.message_role === 'user' ? 'justify-end' : ''}`}>
                {msg.message_role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
                  msg.message_role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {msg.message_content}
                </div>
                {msg.message_role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg p-3 text-sm text-muted-foreground">Печатает...</div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-border">
          <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex gap-2">
            <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Введите сообщение..." className="flex-1" />
            <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
