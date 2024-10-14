import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  sector: z.enum(['tecnologia', 'finanzas', 'salud', 'educacion', 'otros'], {
    required_error: 'Por favor, selecciona un sector.',
  }),
  otherSector: z.string().optional(),
  origin: z.string({
    required_error: 'Por favor, indica tu origen.',
  }),
  linkedinUrl: z.string().url({
    message: 'Por favor, introduce una URL válida de LinkedIn.',
  }),
  profileDescription: z.string().max(100, {
    message: 'La descripción debe tener máximo 100 caracteres.',
  }),
  eventGoal: z.string().max(100, {
    message: 'El objetivo debe tener máximo 100 caracteres.',
  }),
  networkingInterest: z.enum(['tecnologia', 'negocios', 'creatividad', 'otros'], {
    required_error: 'Por favor, selecciona un interés de networking.',
  }),
  otherNetworkingInterest: z.string().optional(),
  desiredConnections: z.string().max(150, {
    message: 'La descripción debe tener máximo 150 caracteres.',
  }),
  offerToOthers: z.string().max(150, {
    message: 'La descripción debe tener máximo 150 caracteres.',
  }),
  keySkills: z.array(z.string()).min(3, {
    message: 'Por favor, introduce al menos 3 habilidades clave.',
  }).max(3, {
    message: 'Máximo 3 habilidades clave.',
  }),
});

export default function SurveyForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      sector: undefined,
      otherSector: '',
      origin: '',
      linkedinUrl: '',
      profileDescription: '',
      eventGoal: '',
      networkingInterest: undefined,
      otherNetworkingInterest: '',
      desiredConnections: '',
      offerToOthers: '',
      keySkills: ['', '', ''],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch('http://localhost:3001/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then(() => {
        toast({
          title: '¡Perfil enviado!',
          description: 'Gracias por participar en las Conexiones Relámpago.',
        });
        form.reset();
      })
      .catch((error) => {
        console.error('Error:', error);
        toast({
          title: 'Error',
          description: 'Hubo un problema al enviar tu perfil. Por favor, intenta de nuevo.',
          variant: 'destructive',
        });
      });
  }

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Perfil para Conexiones Relámpago</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sector</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-2"
                    >
                      {['tecnologia', 'finanzas', 'salud', 'educacion', 'otros'].map((value) => (
                        <FormItem key={value} className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={value} className="sr-only" />
                          </FormControl>
                          <FormLabel className={`font-normal cursor-pointer px-3 py-1 rounded-full ${field.value === value ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('sector') === 'otros' && (
              <FormField
                control={form.control}
                name="otherSector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especifica tu sector</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu sector específico" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿De dónde vienes?</FormLabel>
                  <FormControl>
                    <Input placeholder="Empresa, Universidad, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de LinkedIn</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.linkedin.com/in/tu-perfil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profileDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe tu perfil en una frase</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Desarrollador web apasionado por la IA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Qué esperas conseguir hoy?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Conocer expertos en blockchain" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="networkingInterest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interés principal para el networking</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-2"
                    >
                      {['tecnologia', 'negocios', 'creatividad', 'otros'].map((value) => (
                        <FormItem key={value} className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={value} className="sr-only" />
                          </FormControl>
                          <FormLabel className={`font-normal cursor-pointer px-3 py-1 rounded-full ${field.value === value ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('networkingInterest') === 'otros' && (
              <FormField
                control={form.control}
                name="otherNetworkingInterest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especifica tu interés</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu interés específico" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="desiredConnections"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Con qué perfiles te gustaría conectar?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Inversores en startups, expertos en UX/UI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="offerToOthers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>¿Qué puedes ofrecer a los demás en el evento?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Asesoramiento en marketing digital, contactos en la industria tech" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {[0, 1, 2].map((index) => (
              <FormField
                key={index}
                control={form.control}
                name={`keySkills.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`Habilidad clave ${index + 1}`}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Ej: Innovación, Liderazgo, Análisis`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit" className="w-full">Enviar perfil</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}