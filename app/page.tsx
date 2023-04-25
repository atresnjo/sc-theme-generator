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
  const [currentPrimaryColor, setCurrentPrimaryColor] = useState('#fdffff')
  const [currentBackgroundColor, setCurrentBackgroundColor] = useState('#ffffff')

  const [currentCSS, setCurrentCSS] = useState('')


  return (
    <>

      <main className="bg-white flex h-screen flex-col">
        <div className='flex w-full mt-32 container flex-col max-w-lg'>
          <div className='space-y-6'>
            <div className='w-full flex space-x-2'>
              <span className=''>Primary color</span>
              <Input value={currentPrimaryColor} onChange={(e) => {
                setCurrentPrimaryColor(e.target.value)
              }} type='color'></Input>
              <span>{currentPrimaryColor}</span>
            </div>

            <div className='flex space-x-2'>
              <span className=''>Background color</span>
              <Input value={currentBackgroundColor} onChange={(e) => {
                setCurrentBackgroundColor(e.target.value)
              }} type='color'></Input>
              <span>{currentBackgroundColor}</span>
            </div>
          </div>
          <Button
            className='bg-gray-300'
            onClick={() => {
              let replaced = baseCSS.replace(/(?<=--primary: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(currentPrimaryColor)};`)
                .replace(/(?<=--background: )\d+(\.\d+)?\s\d+(\.\d+)?%\s\d+(\.\d+)?%;?/, `${hexToHSL(currentBackgroundColor)};`)
              const palette = generatePalette(currentPrimaryColor)
              document.documentElement.style.setProperty('--primary', hexToHSL(currentPrimaryColor));
              document.documentElement.style.setProperty('--background', hexToHSL(currentBackgroundColor));
              document.documentElement.style.setProperty('--primary-foreground', hexToHSL(palette.colors[50]));
              setCurrentCSS(replaced)
            }}
          >Generate</Button>
        </div>

        <div className='max-2xl container'>
          <div className='mt-20 text-center'>
            <span>Preview</span>

            <div className='bg-background p-10 border-2 border-black border-dotted'>
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
                  <CardFooter>
                    <Button className="w-full">
                      Create
                    </Button>
                  </CardFooter>
                </Card>
                <div className='space-y-6 '>
                  <Progress value={15} />
                  <Progress value={35} />
                  <Progress value={45} />
                  <Progress value={100} />

                </div>

                <div className='space-y-6'>
                  <Badge className='w-20 h-6'>Badge</Badge>
                  <Slider defaultValue={[33]} max={100} step={1} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className=' container'>
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
