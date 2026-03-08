import DefaultTheme from 'vitepress/theme'
import ParticleBackground from './components/ParticleBackground.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ParticleBackground', ParticleBackground)
  }
}
