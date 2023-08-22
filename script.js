const musicPlayer= document.querySelector(".card-container"),
musicImage= musicPlayer.querySelector(".images img"),
musicName=musicPlayer.querySelector(".paragraph .name"),
musicArtist=musicPlayer.querySelector(".paragraph .artist"),
musicAudio=musicPlayer.querySelector(".audio"),
arrow1=musicPlayer.querySelector(".fa-forward-step"),
arrow2=musicPlayer.querySelector(".fa-backward-step"),
progress=musicPlayer.querySelector(".line-bar"),
area=musicPlayer.querySelector(".music-line"),
playPause=musicPlayer.querySelector(".playIcon"),
repeatIcons=musicPlayer.querySelector(".repeated"),
songList=musicPlayer.querySelector(".list-container"),
moreMusic=musicPlayer.querySelector(".fa-list"),
closeMusic=songList.querySelector(".fa-circle-xmark");

let musicIndex=Math.floor((Math.random()*allMusics.length)+1);

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingNow();
});

function loadMusic(indexNumber){
    musicName.innerText=allMusics[indexNumber-1].name;
    musicArtist.innerText=allMusics[indexNumber-1].artist;
    musicImage.src=`images/${allMusics[indexNumber-1].img}.jpeg`;
    musicAudio.src=`musics/${allMusics[indexNumber-1].src}.mp3`;
}
function playMusic(){
    musicPlayer.classList.add("paused");
    playPause.querySelector("i").classList.remove("fa-play");
    playPause.querySelector("i").classList.add("fa-pause");
    musicAudio.play();
    playingNow();
}
function pauseMusic(){
    musicPlayer.classList.remove("paused");
    playPause.querySelector("i").classList.add("fa-play");
    playPause.querySelector("i").classList.remove("fa-pause");
    musicAudio.pause();
}
function forwardMusic(){
    musicIndex++;
    musicIndex>allMusics.length?musicIndex=1:musicIndex=musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
function backwardMusic(){
    musicIndex--;
    musicIndex<1?musicIndex=allMusics.length:musicIndex=musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
playPause.addEventListener("click",()=>{
    const isMusicPlaying=musicPlayer.classList.contains("paused");
    isMusicPlaying?pauseMusic():playMusic();
});
arrow1.addEventListener("click",()=>{
    forwardMusic();
});
arrow2.addEventListener("click",()=>{
    backwardMusic();
});
musicAudio.addEventListener("timeupdate",(e)=>{
    const currentTime=e.target.currentTime;
    const duration=e.target.duration;
    let progressWidth=(currentTime/duration)*100;
    progress.style.width=`${progressWidth}%`;
    let currentMusic=musicPlayer.querySelector(".current"),
    durationMusic=musicPlayer.querySelector(".duration");
    musicAudio.addEventListener("loadeddata",()=>{
        
        let audioDuration=musicAudio.duration;
        let totalMin=Math.floor(audioDuration/60);
        let totalSeconds=Math.floor(audioDuration%60);
        if(totalSeconds<10){
            totalSeconds=`0${totalSeconds}`;
        }
        durationMusic.innerText=`${totalMin}:${totalSeconds}`;
    });
    let currentMin=Math.floor(currentTime/60);
        let currentSecond=Math.floor(currentTime%60);
        if(currentSecond<10){
            currentSecond=`0${currentSecond}`;
    }
    currentMusic.innerText=`${currentMin}:${currentSecond}`;
});
area.addEventListener("click",(e)=>{
    let click=area.clientWidth;
    let clickBar=e.offsetX;
    let songDuration=musicAudio.duration;
    musicAudio.currentTime=(clickBar/click)*songDuration;
    playMusic();
});
repeatIcons.addEventListener("click",()=>{
    if (repeatIcons) {
        let iconElement = repeatIcons.querySelector("i");
        let iconClassList = iconElement.classList;

        if (iconClassList.contains("fa-repeat")) {
            iconClassList.remove("fa-repeat");
            iconClassList.add("fa-rotate-right");
            iconElement.setAttribute("title", "song looped");
        } else if (iconClassList.contains("fa-rotate-right")) {
            iconClassList.remove("fa-rotate-right");
            iconClassList.add("fa-shuffle");
            iconElement.setAttribute("title", "playback shuffle");
        } else if (iconClassList.contains("fa-shuffle")) {
            iconClassList.remove("fa-shuffle");
            iconClassList.add("fa-repeat");
            iconElement.setAttribute("title", "playlist looped");
        }
    };
});
musicAudio.addEventListener("ended", ()=>{
    if (repeatIcons) {
        let iconElement = repeatIcons.querySelector("i");
        let iconClassList = iconElement.classList;

        if (iconClassList.contains("fa-repeat")) {
            forwardMusic();
        } else if (iconClassList.contains("fa-rotate-right")) {
            musicAudio.currentTime=0;
            loadMusic(musicIndex);
            playMusic();
        } else if (iconClassList.contains("fa-shuffle")) {
            let randomIndex;
            do{
                randomIndex=Math.floor((Math.random()*allMusics.length)+1);
            }while(musicIndex===randomIndex);
            musicIndex=randomIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
        }
    };
});
moreMusic.addEventListener("click",()=>{
    songList.classList.toggle("show");
});
closeMusic.addEventListener("click",()=>{
    moreMusic.click();
});
const ulTag=musicPlayer.querySelector("ul");
for(let i=0; i<allMusics.length; i++){
    let liTag= `<li li-index="${i+1}">
                   <div class="row">
                      <span class="songName">${allMusics[i].name}</span>
                      <p class="songArtist">${allMusics[i].artist}</p>
                    </div>
                    <audio class="${allMusics[i].src}" src="musics/${allMusics[i].src}.mp3"></audio>
                    <span id="${allMusics[i].src}" class="audio-duration">1:45</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);
    let liAudioDuration=ulTag.querySelector(`#${allMusics[i].src}`);
    let liAudioTag=ulTag.querySelector(`.${allMusics[i].src}`);
    liAudioTag.addEventListener("loadeddata",()=>{
        let audioDuration=liAudioTag.duration;
        let totalMin=Math.floor(audioDuration/60);
        let totalSeconds=Math.floor(audioDuration%60);
        if(totalSeconds<10){
            totalSeconds=`0${totalSeconds}`;
        };
        liAudioDuration.innerText=`${totalMin}:${totalSeconds}`;
        liAudioDuration.setAttribute("t-duration",`${totalMin}:${totalSeconds}`);
    });
};
const allLiTags=ulTag.querySelectorAll("li");
function playingNow(){
    for (let j=0; j<allLiTags.length; j++){
        let audioTag=allLiTags[j].querySelector(".audio-duration");
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            let adTags=audioTag.getAttribute("t-duration");
            audioTag.innerText=adTags;
        }
        if(allLiTags[j].getAttribute("li-index")===musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText="playing";
        }
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    };
};
function clicked(element){
    let getIndex=element.getAttribute("li-index");
    musicIndex=getIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
};
