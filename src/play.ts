import { Slowie } from './'

Slowie.init({
  modelDirectory: './models',
  port: 8080,
  onReady: () => console.log(`Listening`)
})
