import { useState, useEffect } from 'react';

import { copy, linkIcon, loader, tick } from '../assets';
import {
  sampleArticleUrl,
  unsupportedArticleMessage,
  useLazyGetSummaryQuery,
} from '../services/article';


const Demo = () => {
  const [article, setArticle] = useState ({
    url:'',
    summary: '',
  }); 

  const [allArticles, setAllArticles] = useState([])

  const [copied, setCopied] = useState('');

  const [error, setError] = useState(null);
  const [getSummary, { isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(localStorage.getItem(`articles`))
    
    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage)
    }
  
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = article.url.trim();
    setError(null);
    const { data, error: summaryError } = await getSummary(url);
    setError(summaryError ?? null);
    if (data?.summary) {
      const newArticle = { url, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles.filter((item) => item.url !== url)];

      setArticle(newArticle);
      setAllArticles(updatedAllArticles);

      localStorage.setItem('articles', JSON.stringify(updatedAllArticles))
    }
  }

  const handleCopy = async (copyUrl) => {
    await navigator.clipboard.writeText(copyUrl);
    setCopied(copyUrl);
    setTimeout(() => setCopied(''), 3000);
  };

  const chooseArticle = (nextArticle) => {
    setError(null);
    setArticle(nextArticle);
  };

  return (
    <section className='mt-16 w-full max-w-xl'>
      {/* Search */}
      <div className='flex flex-col w-full gap-2'>
        <p className='font-satoshi text-sm text-gray-700'>
          Preview only: {unsupportedArticleMessage}{' '}
          <button
            type='button'
            className='text-blue-700 underline'
            disabled={isFetching}
            onClick={() => chooseArticle({ url: sampleArticleUrl, summary: '' })}
          >
            Use example URL
          </button>
        </p>
        <form className='relative flex justify-center items-center' onSubmit={handleSubmit}>
          <img src={linkIcon} alt='' className='absolute left-0 my-2 ml-3 w-5'/>
          <input type='url' aria-label='Article URL' placeholder='Enter a URL'
            value={article.url} disabled={isFetching}
            onChange={(e) => chooseArticle({ url: e.target.value, summary: '' })}
            required className='url_input peer'/>
          <button type='submit' aria-label='Summarize' disabled={isFetching}
            className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700'>
            ↵
          </button>
        </form>

          {/* Browse URL History */}
            <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
          {allArticles.map((item, index) => (
            <div key={`link-${index}`} className='link_card'>
              <button type='button' className='copy_btn' aria-label='Copy article URL'
                onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt=''
                  className='w-[40%] h-[40%] object-contain'
                />
              </button>
              <button type='button' disabled={isFetching} onClick={() => chooseArticle(item)}
                className='flex-1 text-left font-satoshi text-blue-700 font-medium text-sm truncate'>
                {item.url}
              </button>
            </div>
          ))}
        </div>
      </div>
        
      {/* Display Result */}
      <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img src={loader} alt='loader' className='w-20 h-20 object-contain' />
        ) : error ? (
          <p role='alert' className='text-center text-gray-700'>
            {error.status === 'CUSTOM_ERROR' ? error.error : 'Could not load the example summary.'}
          </p>
        ) : (
          article.summary && (
            <div className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                Article <span className='blue_gradient'>Summary</span>
              </h2>
              <div className='summary_box'>
                <p className='font-inter font-medium text-sm text-gray-700'>
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>

  )
}

export default Demo