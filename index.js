import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


document.addEventListener('click',function(e){
    if(e.target.dataset.likes){
        handleLikes(e.target.dataset.likes)
    }else if(e.target.dataset.share){
        handleShare(e.target.dataset.share)
    }else if(e.target.dataset.reply){
        handleReply(e.target.dataset.reply)
    } else if (e.target.id === 'tweet-btn'){
        handleTweet()
    }
})

function handleLikes(tweetId){
    const handleLikesObj = tweetsData.filter(function(tweet){
        return tweetId === tweet.uuid
    })[0]
    
    if(handleLikesObj.isLiked){
        handleLikesObj.likes--
    }else{
        handleLikesObj.likes++
    }
    handleLikesObj.isLiked =!handleLikesObj.isLiked
    render()
}

function handleShare(tweetId){
    const handleShareObj = tweetsData.filter(function(tweet){
        return tweetId === tweet.uuid
    })[0]
    
    if(handleShareObj.isRetweeted){
        handleShareObj.retweets--
    }else{
        handleShareObj.retweets++
    }
    handleShareObj.isRetweeted =!handleShareObj.isRetweeted
    render()
}

function handleReply(commentId){
    document.getElementById(`replies-${commentId}`).classList.toggle('hidden') 
}

function handleTweet(){
    const tweetInput = document.getElementById('tweet-input')
    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Maliq`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: `${tweetInput.value}`,
            replies: [],
            isLiked: false, 
            isRetweeted: false,
            uuid: uuidv4()
        })
    tweetInput.value = ''
    }
    render()
    
}

function getFeedHtml(){
    
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){

        let likeIconClass = ''
        if(tweet.isLiked){
            likeIconClass = 'liked'
        }

        let retweetIconClass = ''
        if(tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        let commentHtml = ''
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                commentHtml+=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                        </div>
                </div>
                `
            })
        }


        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}" ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}" data-likes="${tweet.uuid}"></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}" data-share="${tweet.uuid}"></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${commentHtml}
    </div>
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()

}

render()
