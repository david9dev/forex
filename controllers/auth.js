const axios = require('axios');
const {DEMO_USERNAME, DEMO_PASSWORD, APPKEY, LIVE_URL, EUR_USD_MARKET_ID} = process.env
let session = null

const now = Math.round(Date.now()/1000) - 200;
module.exports = {
  login: function(request, response)
  {
    const auth = {
      UserName: DEMO_USERNAME,
      Password: DEMO_PASSWORD,
      AppKey: APPKEY
    }

    axios.post(`${LIVE_URL}/session`, auth).then((res) =>
    {
      response.status(200).send(res.data)
      session = res.data.Session
      // console.log(request)
    }).catch((error) =>
    {
      response.status(201).send(error)
    })
  },

  logout: function(request, response)
  {
    const auth = {
      UserName: DEMO_USERNAME,
      Session: session
  
    }
    axios.post(`${LIVE_URL}/session/deleteSession?UserName=${DEMO_USERNAME}&Session=${session}`, auth).then((res) =>
    {
      response.status(200).send(res.data)
      session = null
    }).catch((error) =>
    {
      response.status(201).send(error)
    })
  },
  getMarketInfo: function(request, response)
  {
    axios.get(`${LIVE_URL}/market/fullsearchwithtags?SearchByMarketName=TRUE&TagId=80&Query=EUR%2FUSD&MaxResults=10&UserName=${DEMO_USERNAME}&Session=${session}`).then((res) =>
    {
      response.status(200).send(res.data)
    }).catch((error) =>
    {
      response.status(201).send(error)
    })
  },
  getMarketHistory: function(request, response)
  {
    axios.get(`${LIVE_URL}/market/${EUR_USD_MARKET_ID}/barhistory?interval=MINUTE&span=1&PriceBars=20&PriceType=BID&UserName=${DEMO_USERNAME}&Session=${session}`).then((res) =>
    {
      console.log(res.data.PriceBars.length)
      response.status(200).send(res.data)
    }).catch((error) =>
    {
      response.status(201).send(error)
    })
  },
  getMarketSpread: function(request, response)
  {
    const promises = [];
    let ask = null;
    let bid = null;
    promises.push(
      axios.get(`https://ciapi.cityindex.com/TradingAPI/market/${EUR_USD_MARKET_ID}/barhistory?interval=MINUTE&span=15&PriceBars=1&PriceType=ASK&UserName=${DEMO_USERNAME}&Session=${session}`).then((res) =>
    {
      // response.status(200).send(res.data)
      ask = res.data
    }).catch((error) =>
    {
      response.status(201).send(error)
    })
    )
    promises.push(
      axios.get(`https://ciapi.cityindex.com/TradingAPI/market/${EUR_USD_MARKET_ID}/barhistory?interval=MINUTE&span=15&PriceBars=1&PriceType=BID&UserName=${DEMO_USERNAME}&Session=${session}`).then((res) =>
    {
      // response.status(200).send(res.data)
      bid = res.data
    }).catch((error) =>
    {
      response.status(201).send(error)
    })
    )
    Promise.all(promises).then(() =>
    {
      console.log(bid);
      console.log(ask);
      response.status(200).send(`${(ask.PartialPriceBar.Close - bid.PartialPriceBar.Close) * 21500}`);
      // response.status(200).send();
    })
  },
  getAppendedMarketHistory: function(request, response)
  {
    axios.get(`${LIVE_URL}/market/${EUR_USD_MARKET_ID}/barhistory?interval=MINUTE&span=1&PriceBars=20&PriceType=BID&UserName=${DEMO_USERNAME}&Session=${session}`).then((res) =>
    {
      console.log(res.data.PriceBars.length)
      response.status(200).send(res.data)
    }).catch((error) =>
    {
      response.status(201).send(error)
    })
  },
  testSetInterval: function(request, response)
  {
    let counter = 1;
    let stopInterval = null
    const jsonObject = {
      AppendPriceBars: [],
      queryPriceBars: [],
    }
    const priceBeforeUrl = `${LIVE_URL}/market/${EUR_USD_MARKET_ID}/barhistorybefore?interval=MINUTE&span=1&toTimestampUTC=${now}&UserName=${DEMO_USERNAME}&Session=${session}`;
    const priceBetweenUrl = `${LIVE_URL}/market/${EUR_USD_MARKET_ID}/barhistorybetween?UserName=${DEMO_USERNAME}&Session=${session}&interval=MINUTE&span=1&fromTimestampUTC=${now - 21000000}&toTimestampUTC=${now - 10000000}&PriceType=BID`
    const priceAfterUrl = `${LIVE_URL}/market/${EUR_USD_MARKET_ID}/barhistoryafter?UserName=${DEMO_USERNAME}&Session=${session}&interval=MINUTE&span=1&fromTimestampUTC=${now}`
    // const now = 1587507517577;
    
    // stopInterval = setInterval(() =>
    // {
    //   console.log(counter)
    //   counter++;
    //   ///market/${EUR_USD_MARKET_ID}/barhistorybetween?interval=MINUTE&span=1&fromTimestampUTC=${Date.now()-100000}&toTimestampUTC=${Date.now()}
    //   // axios.get(`https://ciapi.cityindex.com/TradingAPI/market/${EUR_USD_MARKET_ID}/barhistory?interval=MINUTE&span=1&PriceBars=${1}&PriceType=BID&UserName=${DEMO_USERNAME}&Session=${session}`).then((res) =>
    //   axios.get(`https://ciapi.cityindex.com/TradingAPI/market/${EUR_USD_MARKET_ID}/barhistorybetween?interval=MINUTE&span=1&fromTimestampUTC=${now - 100000}&toTimestampUTC=${now}&PriceType=BID&PriceBars=100&UserName=${DEMO_USERNAME}&Session=${session}`).then((res) =>
    //   {
    //     // console.log(res.data.PriceBars.length)
    //     res.data.PriceBars.forEach((curVal) =>
    //     {
    //       jsonObject.AppendPriceBars.push(curVal)
    //     })
    //     // response.status(200).send(res.data)
    //   }).catch((error) =>
    //   {
    //     response.status(201).send(error)
    //   })
    //   if(counter > 1)
    //   {
    //     clearInterval(stopInterval)
    //     console.log('append', jsonObject)
    //     // jsonObject.queryPriceBars.forEach((curVal, index) =>
    //     // {
    //     //   console.log(curVal.BarDate ===jsonObject.AppendPriceBars[index].BarDate)
    //     // })
    //   }
    // }, 2000)
    // axios.get(`https://ciapi.cityindex.com/TradingAPI/market/${EUR_USD_MARKET_ID}/barhistorybetween?interval=MINUTE&span=1&fromTimestampUTC=${now-500000}&toTimestampUTC=${now-400000}&PriceType=BID&UserName=${DEMO_USERNAME}&Session=${session}`).then((res) =>
    axios.get(priceBeforeUrl).then((res) =>
    // axios.get(`https://ciapi.cityindex.com/TradingAPI/market/${EUR_USD_MARKET_ID}/barhistory?interval=MINUTE&span=1&PriceBars=5&PriceType=BID&UserName=${DEMO_USERNAME}&Session=${session}`).then((res) =>
    {
      console.log('20 request',res.data.PriceBars.length)
      // console.log(now - 10100000)
      // jsonObject.queryPriceBars = [...res.data.PriceBars]
      response.status(200).send(res.data)
    }).catch((error) =>
    {
      response.status(201).send(error)
    })
    // response.sendStatus(200);
  }
}