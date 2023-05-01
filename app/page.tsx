"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { generatePalette, hexToHSL } from '@/lib/colors'
import { CopyBlock, dracula } from "react-code-blocks";
import { Progress } from '@/components/ui/progress'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { ColorPicker } from '@/components/ui/colorPicker'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Configuration, OpenAIApi } from "openai"
import toast, { Toaster } from 'react-hot-toast'

let baseCSS = `
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;

  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  --popover: 0 0% 100%;
  --popover-foreground: 222.2 47.4% 11.2%;

  --card: 0 0% 100%;
  --card-foreground: 222.2 47.4% 11.2%;

  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;

  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;

  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  --destructive: 0 100% 50%;
  --destructive-foreground: 210 40% 98%;

  --ring: 215 20.2% 65.1%;

  --radius: 0.5rem;
}

`

export default function Home() {
  const [currentPrimaryColor, setCurrentPrimaryColor] = useState('#0f172a')
  const [currentSecondaryColor, setCurrentSecondaryColor] = useState('#f1f5f9')
  const [currentForegroundColor, setCurrentForegroundColor] = useState('#0f172a')
  const [currentBackgroundColor, setCurrentBackgroundColor] = useState('#ffffff')
  const [currentDestructiveColor, setCurrentDestructiveColor] = useState('#ff0000')
  const [currentAccentColor, setCurrentAccentColor] = useState('#532355')
  const [currentMutedColor, setCurrentMutedColor] = useState('#f1f5f9')
  const [currentOpenApiKey, setCurrentOpenApiKey] = useState('')
  const [currentOpenApiModel, setCurrentOpenApiModel] = useState('gpt-3.5-turbo')
  const [currentCSS, setCurrentCSS] = useState(baseCSS)

  return (
    <>
      <Toaster />

      <main className="bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100 flex h-screen flex-col">
        <h1 className='text-5xl tracking-widest text-center mt-12 animate-text-shimmer bg-clip-text text-transparent bg-[linear-gradient(110deg,#2a2726,45%,#a2f09b,55%,#e2e8f0)] bg-[length:250%_100%]'>Generate your theme</h1>

        <div className='flex w-full mt-32 container flex-col max-w-lg'>
          <Tabs defaultValue="manually">
            <TabsList>
              <TabsTrigger value="manually">Manually</TabsTrigger>
              <TabsTrigger value="chatgpt">ChatGPT</TabsTrigger>
            </TabsList>
            <TabsContent className='space-y-1 flex-col' value="manually">
              <ColorPicker text='Primary' color={currentPrimaryColor} onChange={setCurrentPrimaryColor} />
              <ColorPicker text='Foreground' color={currentForegroundColor} onChange={setCurrentForegroundColor} />
              <ColorPicker text='Secondary' color={currentSecondaryColor} onChange={setCurrentSecondaryColor} />
              <ColorPicker text='Background' color={currentBackgroundColor} onChange={setCurrentBackgroundColor} />
              <ColorPicker text='Destructive' color={currentDestructiveColor} onChange={setCurrentDestructiveColor} />
              <ColorPicker text='Accent' color={currentAccentColor} onChange={setCurrentAccentColor} />
              <ColorPicker text='Muted' color={currentMutedColor} onChange={setCurrentMutedColor} />
              <Button
                className='w-full mt-2 border-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                onClick={() => {
                  const primaryPalette = generatePalette(currentPrimaryColor)
                  const mutedPalette = generatePalette(currentMutedColor)
                  const secondaryPalette = generatePalette(currentSecondaryColor)
                  const accentPalette = generatePalette(currentAccentColor)
                  const destructivePalette = generatePalette(currentAccentColor)

                  setCurrentCSS(baseCSS)
                  let replaced = baseCSS.replace(/(?<=--primary: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(currentPrimaryColor)};`)
                    .replace(/(?<=--primary-foreground: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(primaryPalette.colors[50])};`)
                    .replace(/(?<=--destructive: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(currentDestructiveColor)};`)
                    .replace(/(?<=--destructive-foreground: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(destructivePalette.colors[50])};`)
                    .replace(/(?<=--secondary: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(currentSecondaryColor)};`)
                    .replace(/(?<=--secondary-foreground: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(secondaryPalette.colors[50])};`)
                    .replace(/(?<=--foreground: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(currentForegroundColor)};`)
                    .replace(/(?<=--background: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(currentBackgroundColor)};`)
                    .replace(/(?<=--muted: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(currentMutedColor)};`)
                    .replace(/(?<=--muted-foreground: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(mutedPalette.colors[900])};`)
                    .replace(/(?<=--accent: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(currentAccentColor)};`)
                    .replace(/(?<=--accent-foreground: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(accentPalette.colors[50])};`)

                  document.documentElement.style.setProperty('--foreground', hexToHSL(currentForegroundColor));
                  document.documentElement.style.setProperty('--destructive', hexToHSL(currentDestructiveColor));
                  document.documentElement.style.setProperty('--destructive-foreground', hexToHSL(destructivePalette.colors[50]));
                  document.documentElement.style.setProperty('--primary', hexToHSL(currentPrimaryColor));
                  document.documentElement.style.setProperty('--primary-foreground', hexToHSL(primaryPalette.colors[50]));
                  document.documentElement.style.setProperty('--secondary', hexToHSL(currentSecondaryColor));
                  document.documentElement.style.setProperty('--secondary-foreground', hexToHSL(secondaryPalette.colors[50]));
                  document.documentElement.style.setProperty('--background', hexToHSL(currentBackgroundColor));
                  document.documentElement.style.setProperty('--muted', hexToHSL(currentMutedColor));
                  document.documentElement.style.setProperty('--muted-foreground', hexToHSL(mutedPalette.colors[900]));
                  document.documentElement.style.setProperty('--accent', hexToHSL(currentAccentColor));
                  document.documentElement.style.setProperty('--accent-foreground', hexToHSL(accentPalette.colors[50]));
                  setCurrentCSS(replaced)
                }}
              >Generate</Button>
            </TabsContent>
            <TabsContent className='space-y-1 flex-col' value="chatgpt">
              <Select value={currentOpenApiModel} onValueChange={(e) => setCurrentOpenApiModel(e)}>
                <SelectTrigger>
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>GPT-Model</SelectLabel>
                    <SelectItem value="gpt-3.5-turbo">GPT 3.5 turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT 4</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Label>OpenAPI Key</Label>
              <Input type='password' value={currentOpenApiKey} onChange={(e) => setCurrentOpenApiKey(e.target.value)} />
              <ColorPicker text='Primary' color={currentPrimaryColor} onChange={setCurrentPrimaryColor} />
              <ColorPicker text='Foreground' color={currentForegroundColor} onChange={setCurrentForegroundColor} />
              <ColorPicker text='Secondary' color={currentSecondaryColor} onChange={setCurrentSecondaryColor} />
              <ColorPicker text='Background' color={currentBackgroundColor} onChange={setCurrentBackgroundColor} />
              <ColorPicker text='Destructive' color={currentDestructiveColor} onChange={setCurrentDestructiveColor} />
              <ColorPicker text='Accent' color={currentAccentColor} onChange={setCurrentAccentColor} />
              <ColorPicker text='Muted' color={currentMutedColor} onChange={setCurrentMutedColor} />
              <Button
                className='w-full mt-2 border-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                onClick={async () => {

                  const configuration = new Configuration({
                    apiKey: currentOpenApiKey,
                  });

                  const openai = new OpenAIApi(configuration);

                  try {
                    const completion = await toast.promise(
                      openai.createChatCompletion({
                        model: currentOpenApiModel,
                        messages: [
                          {
                            "role": "user",
                            "content": `You will generate a beautiful light mode color palette for me and return it as json. Do not return anything else. ONLY the json. Colors need to be in hex format like --muted: #ffffff. Pick colors that you think that match beautifully with each other.Here are the possible values background, foreground, secondary, accent, muted, primary, destructive`
                          }
                        ]
                      }),
                      {
                        loading: "Generating theme...",
                        success: "Successfully generated theme! 🚀",
                        error: "There was an error",
                      },
                      {
                        success: {
                          duration: 1000,
                        },
                      }
                    )

                    if (!completion || completion.data.choices.length == 0) {
                      toast.error('There was an error')
                      return
                    }


                    const parsed = JSON.parse(completion.data!.choices[0]?.message!.content)

                    setCurrentBackgroundColor(parsed.background)
                    setCurrentMutedColor(parsed.muted)
                    setCurrentForegroundColor(parsed.foreground)
                    setCurrentDestructiveColor(parsed.destructive)
                    setCurrentAccentColor(parsed.accent)
                    setCurrentPrimaryColor(parsed.primary)
                    setCurrentSecondaryColor(parsed.secondary)

                    const primaryPalette = generatePalette(parsed.primary)
                    const mutedPalette = generatePalette(parsed.muted)
                    const secondaryPalette = generatePalette(parsed.secondary)
                    const accentPalette = generatePalette(parsed.accent)
                    const destructivePalette = generatePalette(parsed.destructive)

                    setCurrentCSS(baseCSS)
                    let replaced = baseCSS.replace(/(?<=--primary: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(parsed.primary)};`)
                      .replace(/(?<=--primary-foreground: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(primaryPalette.colors[50])};`)
                      .replace(/(?<=--destructive: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(parsed.destructive)};`)
                      .replace(/(?<=--destructive-foreground: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(destructivePalette.colors[50])};`)
                      .replace(/(?<=--secondary: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(parsed.secondary)};`)
                      .replace(/(?<=--secondary-foreground: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(secondaryPalette.colors[50])};`)
                      .replace(/(?<=--foreground: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(parsed.foreground)};`)
                      .replace(/(?<=--background: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(parsed.background)};`)
                      .replace(/(?<=--muted: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(parsed.muted)};`)
                      .replace(/(?<=--muted-foreground: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(mutedPalette.colors[900])};`)
                      .replace(/(?<=--accent: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(parsed.accent)};`)
                      .replace(/(?<=--accent-foreground: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(accentPalette.colors[50])};`)

                    document.documentElement.style.setProperty('--foreground', hexToHSL(parsed.foreground));
                    document.documentElement.style.setProperty('--destructive', hexToHSL(parsed.destructive));
                    document.documentElement.style.setProperty('--destructive-foreground', hexToHSL(destructivePalette.colors[50]));
                    document.documentElement.style.setProperty('--primary', hexToHSL(parsed.primary));
                    document.documentElement.style.setProperty('--primary-foreground', hexToHSL(primaryPalette.colors[50]));
                    document.documentElement.style.setProperty('--secondary', hexToHSL(parsed.secondary));
                    document.documentElement.style.setProperty('--secondary-foreground', hexToHSL(secondaryPalette.colors[50]));
                    document.documentElement.style.setProperty('--background', hexToHSL(parsed.background));
                    document.documentElement.style.setProperty('--muted', hexToHSL(parsed.muted));
                    document.documentElement.style.setProperty('--muted-foreground', hexToHSL(mutedPalette.colors[900]));
                    document.documentElement.style.setProperty('--accent', hexToHSL(parsed.accent));
                    document.documentElement.style.setProperty('--accent-foreground', hexToHSL(accentPalette.colors[50]));
                    setCurrentCSS(replaced)
                  }
                  catch (error) {
                  }
                }}
              >Generate</Button>
            </TabsContent>
            <TabsContent value="password">Change your password here.</TabsContent>
          </Tabs>


        </div>

        <div className='max-2xl container'>
          <div className='mt-20 text-center'>
            <span>Preview</span>

            <div className='rounded-xl bg-background p-10 border-2'>
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>You have 3 unread messages.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className=" flex items-center space-x-4 rounded-md border p-4">
                      <div className="flex-1 space-y-1">
                        <Switch />
                        <p className="text-sm font-medium leading-none">
                          Push Notifications
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Send notifications to device.
                        </p>
                      </div>
                    </div>
                    <div>

                    </div>
                  </CardContent>
                  <CardFooter className='flex flex-col space-y-2'>
                    <Button className="w-full ">
                      Create
                    </Button>
                    <Button variant={'secondary'} className="w-full">
                      Secondary
                    </Button>
                    <Button variant={'destructive'} className="w-full">
                      Destructive
                    </Button>
                    <Button variant={'ghost'} className="w-full">
                      Ghost accent Hover
                    </Button>
                  </CardFooter>
                </Card>
                <div className='space-y-6 '>
                  <Progress value={15} />
                  <Progress value={35} />
                  <Progress value={45} />
                  <Progress value={100} />
                </div>
                <Tabs defaultValue="account">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account</CardTitle>
                        <CardDescription>
                          Make changes to your account here. Click save when you are  done.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" defaultValue="Pedro Duarte" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="username">Username</Label>
                          <Input id="username" defaultValue="@peduarte" />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button>Save changes</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  <TabsContent value="password">
                    <Card>
                      <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                          Change your password here. After saving, you will be logged out.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <Label htmlFor="current">Current password</Label>
                          <Input id="current" type="password" />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="new">New password</Label>
                          <Input id="new" type="password" />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button>Save password</Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className='space-y-6'>
                  <Badge className='w-20 h-6'>Badge</Badge>
                  <Slider defaultValue={[33]} max={100} step={1} />
                  <Alert variant="default">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Your session has expired. Please log in again.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Your session has expired. Please log in again.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='container'>
          <div className='mt-44 text-center'>
            <span>Generated CSS</span>
            <CopyBlock
              text={currentCSS}
              codeBlock
              language={'css'}
              theme={dracula}
              wrapLines
            />
          </div>
        </div>
      </main >
    </>
  )
}
