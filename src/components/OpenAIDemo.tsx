import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function OpenAIDemo() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Hubo un error al procesar tu solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Demo de OpenAI</h1>
      <Card>
        <CardHeader>
          <CardTitle>Interactúa con OpenAI</CardTitle>
          <CardDescription>
            Escribe un prompt y obtén una respuesta generada por IA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="Escribe tu prompt aquí..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mb-4"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Procesando...' : 'Enviar'}
            </Button>
          </form>
        </CardContent>
        {response && (
          <CardFooter>
            <div>
              <h3 className="font-semibold mb-2">Respuesta:</h3>
              <p className="text-sm">{response}</p>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}