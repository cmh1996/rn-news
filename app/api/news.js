//获取新闻
export function getNewsByChannel(channel,start=0,end=10){
	return new Promise((resolve,reject)=>{
		fetch(`http://www.yidianzixun.com/home/q/news_list_for_channel?channel_id=${channel}&cstart=${start}&cend=${end}&__from__=wap&appid=web_yidian`)
	    .then((response) => response.json())
	    .then((json)=>{
	      if(json.code===0){
	        let newsArr = json.result;
	        for(let item of newsArr){
	          //为每条新闻配上key
	          item.key = item.docid;
	          //处理图片地址
	          if(item.image_urls){
	            for(let i=0;i<item.image_urls.length;i++){
	              item.image_urls[i] = `http://i1.go2yd.com/image.php?url=${item.image_urls[i]}&type=thumbnail_324x216`;
	            }
	          }
	        }
	        resolve(newsArr);
	      }else{
	        throw new Error(json.status);
	      }
	    })
	    .catch((e)=>{
	      reject(e.toString())
	    })
	})
}


//获取新闻热搜
export function getHotKey(){
	return new Promise((resolve,reject)=>{
		fetch(`http://www.yidianzixun.com/home/q/hot_search_keywords?appid=web_yidian`)
	    .then((response) => response.json())
	    .then((json)=>{
	      if(json.code===0){
	      	let keywords = json.keywords.slice();
	      	let wordArr = [];
	      	keywords.map((item,index)=>{
	      		wordArr.push(item.name);
	      	});
	        resolve(wordArr);
	      }else{
	        throw new Error(json.status);
	      }
	    })
	    .catch((e)=>{
	      reject(e.toString())
	    })
	})
}

//获取搜索实时匹配
export function getTipsWords(words){
	return new Promise((resolve,reject)=>{
		fetch(`http://www.yidianzixun.com/home/q/search_channel?word=${encodeURIComponent(words)}&appid=web_yidian`)
	    .then((response) => response.json())
	    .then((json)=>{
	      if(json.code===0){
	      	let wordsArr = [];
	      	if(json.channels){
		      	let arr = json.channels.slice();
		      	arr.map((item,index)=>{
		      		if(item.type==='keyword' || item.type==='sugkwd'){
		      			wordsArr.push(item.name);
		      		}
		      	})
		    }
		    resolve(wordsArr);
	      }else{
	        throw new Error(json.status);
	      }
	    })
	    .catch((e)=>{
	      reject(e.toString())
	    })
	})
}


//获取视频列表
export function getVideoList(start=0,end=10){
	return new Promise((resolve,reject)=>{
		fetch(`http://www.yidianzixun.com/home/q/news_list_for_channel?channel_id=u13746&cstart=${start}&cend=${end}&infinite=true&refresh=1&__from__=wap&appid=web_yidian`)
	    .then((response) => response.json())
	    .then((json)=>{
	      if(json.code===0){
	      	let videoArr = [];
	      	json.result.map((item,index)=>{
	      		if(item.video_url){
	      			item.key = item.video_url;
	      			videoArr.push(item)
	      		}
	      	})
		    resolve(videoArr);
	      }else{
	        throw new Error(json.status);
	      }
	    })
	    .catch((e)=>{
	      reject(e.toString())
	    })
	})
}

//获取发现页面列表
export function getFindList(offset=10){
	return new Promise((resolve,reject)=>{
		fetch(`https://m.guokr.com/apis/minisite/article.json?retrieve_type=by_channel_v2&channel_key=hot&subject_key=all&limit=10&offset=${offset}`)
	    .then((response) => response.json())
	    .then((json)=>{
	      if(json.ok){
	      	resolve(json.result)
	      }else{
	        throw new Error('暂时无法获得数据');
	      }
	    })
	    .catch((e)=>{
	      reject(e.toString())
	    })
	})
}
