import { extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const Theme = extendTheme({ 
  config,
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'light' ? 'white' : 'black',
      },
    }),
  },
})

export default Theme