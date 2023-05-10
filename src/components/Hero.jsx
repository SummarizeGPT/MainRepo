import React from 'react'
import { logo } from '../assets';

const Hero = () => {
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <nav className='flex justify-between items-center w-full mb-10 pt-5'>
        <img src={logo} alt="summarizeGPT_logo"
        className="w-30 h-16 object-contain"/>

        <button type="button" onClick={() => window.open('https://github.com/SummarizeGPT')} className="black_btn">
          GitHub
        </button>        
      </nav>

      <h1 className="head_text">
        Summarize Articles with <br className='max-md:hidden'/>
        <span className='orange_gradient'>OpenAI GPT-4</span>
      </h1>
      <h2 className='desc'>
        Simplify your reading with SummarizeGPT, an open-source article summarizer that transforms lengthy articles into a short and sweet summary!

      </h2>

    </header>
  )
}

export default Hero