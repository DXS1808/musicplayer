/**
         * Render songs
         * Scroll top
         * play/ pause/ seek/ play
         * CD ratate
         * Next/prev
         * Random
         * Next/ Repeat when ended
         * Active song
         * Scroll active song into view
         * Play song when click
         */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
            const player = $('.player')
            const cd = $('.cd-thumb')
            const heading = $('header h2')
            const cdThumb = $('.cd-thumb')
            const audio = $('#audio')
            const playBtn = $('.btn-toggle-play')
            const progress = $('#progress')
            const prevBtn = $('.btn-prev')
            const nextBtn = $('.btn-next')
            const randomBtn = $('.btn-random')
            const repeatBtn = $('.btn-repeat')
            const playlist = $('.playlist')
            const pause = $('#pause')



const app = {

    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Sai Cách Yêu',
            singer: 'Lê Bảo Bình',
            path: './music/song1.mp3',
            image: './img/song1.jpg'
        },
        {
            name: 'Anh Mệt Rồi',
            singer: 'Anh Quân',
            path: './music/song2.mp3',
            image: './img/song2.jpg'
        },
        {
            name: 'Đánh Mất Em',
            singer: 'Đăng Quang',
            path: './music/song3.mp3',
            image: './img/song3.jpg'
        },
        {
            name: 'Thức Giấc',
            singer: 'DA LAB',
            path: './music/song4.mp3',
            image: './img/song4.jpg'
        },
        {
            name: 'Anh Sợ Yêu',
            singer: 'Anh Quân',
            path: './music/song5.mp3',
            image: './img/song5.jpg'
        },
        {
            name: 'Em là hoàng hôn',
            singer: 'V.A',
            path: './music/song6.mp3',
            image: './img/song6.jpg'
        },
        {
            name: 'Gặp gỡ, yêu thương và được bên em',
            singer: 'Phan Mạnh Quỳnh',
            path: './music/song7.mp3',
            image: './img/song7.jpg'
        },
        {
            name: 'Có một nơi như thế',
            singer: 'Phan Mạnh Quỳnh',
            path: './music/song8.mp3',
            image: './img/song8.jpg'
        }
    ],

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex? 'active' : " " }" data-index="${index}">
                    <div class="thumb" >
                        <img src="${song.image}">
                    </div>
                    <div class="body">

                            <h3 class="tittle">${song.name}</h3>
                            <p class="author"> ${song.singer}</p>

                    </div>
                   
                </div>
                `
        })
       $('.playlist').innerHTML=htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong',{
            get : function () {
                return this.songs[this.currentIndex]
                
            }   
        })
        
    },

    handleEvents: function () {
        const _this = this;
        const cdHeight = cd.offsetHeight;

        // xu ly CD quay 
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })

        cdThumbAnimate.pause()


        // xu ly phong to thu nho CD
        document.onscroll = function (){
            const scrollTop = window.scrollX || document.documentElement.scrollTop
            const newCdHeight = cdHeight-scrollTop

            cd.style.height = newCdHeight > 0 ? newCdHeight + 'px' : 0
            cd.style.opacity = newCdHeight / cdHeight
        }

        // xu khi playlist
        playBtn.onclick = function () {
            if(_this.isPlaying){
                audio.pause()
            }
            else{
                audio.play()
            }   
        }
        audio.onplay = function () {
            _this.isPlaying=true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        //xử lý khi tua xong 
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // khi next song 

        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
            _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
            _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //xử lý random

        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            randomBtn.classList. toggle('active', _this.isRandom)
        }

        // xử lý next song khi audio ended
        audio.onended = function () {
            if(_this.isRepeat){
                audio.play()
            }else{
            nextBtn.click()
            }
        }

        //xử lý phát lại 1 bài hat

        repeatBtn.onclick =function(){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }


        // lắng nghe hành vi click vào playlist

        playlist.onclick = function(e){

            const songNode  = e.target.closest('.song:not(.active)')
            
            if(e.target.closest('.song:not(.active)')){

                //xử lý khi clcik vào song

                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }

                if(e.target.closest('.option')){

                }
                
            }
        }

        pause.onclick = function(){
            _this.isPlaying = !_this.isPlaying
            // pause.classList.remove("far fa-pause-circle")
            pause.classList.toggle('fa-play-circle',_this.isPlaying)
        }


    },

    loadCurrentSong : function () {
       
        heading.innerText = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },

    nextSong: function () {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.currentIndex--
        if(this.currentIndex <0){
            this.currentIndex = this.songs.length-1
        }
        this.loadCurrentSong()
    },

    playRandomSong : function () {
        let newIndex
        do{
            newIndex= Math.floor(Math.random()*this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    scrollToActiveSong: function () {
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'scroll',
                block: 'nearest'

            })
        },300)
    },



    start: function () {

        this.defineProperties();

        this.handleEvents()

        this.loadCurrentSong()

        this.render()
    }
}

app.start()
