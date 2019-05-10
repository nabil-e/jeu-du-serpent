window.onload = function(){

    var canvasWidth = 900
    var canvasHeight = 600
    var blockSize = 30
    var ctx
    var delay = 100

    var snakee
    var applee
    var widthInBlocks = canvasWidth / blockSize
    var heightInBlocks = canvasHeight / blockSize
    var score
    var timeout

    init()

// INIT

    function init(){
        // creation canvas

        var canvas = document.createElement('canvas')
        canvas.height = canvasHeight
        canvas.width = canvasWidth
        canvas.style.border = '25px solid gray'
        canvas.style.margin = '50px auto'
        canvas.style.display = 'block'
        canvas.style.backgroundColor = "#ddd"
        document.body.appendChild(canvas)
        ctx = canvas.getContext('2d')
        snakee = new Snake([[6,4], [5,4], [4,4]], 'east')
        applee = new Apple([10,10])
        score = 0
        refreshCanvas()

        
    }

// REFRESH

    function refreshCanvas(){
        // creation rectangle bleu
        snakee.advance()

        if(snakee.checkCollision()){
            gameOver()
        }else{
            if(snakee.isEatingApple(applee)){
                score++
                snakee.eatApple = true
                do{
                applee.setNewPosition()
                }while(applee.isOnSnake(snakee))
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight)
            drawScore()
            snakee.draw()
            applee.draw()
            
            timeout = setTimeout(refreshCanvas, delay)    
        }
    }

    function gameOver(){
        ctx.save()
        ctx.font = 'bold 70px sans-serif'
        ctx.fillStyle = '#000'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle' // aligne le centre du texte par rapport au milieu du canvas
        ctx.strokeStyle = "white"
        ctx.lineWidth = 5
        var centreX = canvasWidth / 2
        var centreY = canvasHeight / 2
        ctx.strokeText('Game Over', centreX , centreY + 180) 
        ctx.fillText('Game Over', centreX , centreY + 180)
        ctx.font = 'bold 30px sans-serif'
        ctx.strokeText('Appuyer sur espace pour rejouer',centreX , centreY + 90)
        ctx.fillText('Appuyer sur espace pour rejouer',centreX , centreY + 90)
        ctx.restore()
    }

    function restart(){
        snakee = new Snake([[6,4], [5,4], [4,4]], 'east')
        applee = new Apple([10,10])
        score = 0
        clearTimeout(timeout)
        refreshCanvas()
    }

    function drawScore(){
        ctx.save()
        ctx.font = 'bold 150px sans-serif'
        ctx.fillStyle = 'gray'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle' // aligne le centre du texte par rapport au milieu du canvas
        var centreX = canvasWidth / 2
        var centreY = canvasHeight / 2
        ctx.fillText(score.toString(), centreX, centreY)
        ctx.restore()
    }

    function drawBlock(ctx, position){
        var x = position[0] * blockSize
        var y = position[1] * blockSize
        ctx.fillRect(x, y, blockSize, blockSize)
    }

// SNAKE

    function Snake(body, direction){
        this.body = body
        this.direction = direction
        this.eatApple = false
        this.draw = function(){
        ctx.save()
        ctx.fillStyle = 'blue'
        for(var i = 0; i < this.body.length; i++){
            drawBlock(ctx, this.body[i])
        }
        ctx.restore()
        }

        this.advance = function(){
            var nextPosition = this.body[0].slice();
            switch(this.direction){
                case 'north':
                    // nextPosiion[1] -= 1
                    nextPosition[1]--
                    break
                case 'south':
                    // nextPosiion[1] += 1
                    nextPosition[1]++
                    break
                case 'east':
                    nextPosition[0]++
                    break
                case 'west':
                    nextPosition[0]--
                    break
                default:
                    throw('invalid direction')
            }
            this.body.unshift(nextPosition)
            if(!this.eatApple){
                this.body.pop()
            }else{
                this.eatApple = false
            }
        }
        
        this.setDirection = function (newDirection){
            var allowedDirection
            switch(this.direction){
                case 'west':
                case 'east':
                    allowedDirection = ['north', 'south']
                    break
                case 'south':
                case 'north':
                    allowedDirection = ['east', 'west']
                    break
                default:
                    throw('invalid direction')
            };
            if (allowedDirection.indexOf(newDirection) > -1)
            {
                this.direction = newDirection
            }
        };
        this.checkCollision = function(){
            var wallCollision = false
            var snakeCollision = false
            var head = this.body[0]
            var rest = this.body.slice(1)
            var snakeX = head[0]
            var snakeY = head[1]
            var minX = 0
            var minY = 0
            var maxX = widthInBlocks - 1
            var maxY = heightInBlocks - 1
            var isNotBettwenHorizontalWall = snakeX < minX || snakeX > maxX
            var isNotBettwenVerticalWall = snakeY < minY || snakeY > maxY

            if(isNotBettwenHorizontalWall || isNotBettwenVerticalWall){
                wallCollision = true
            }
            for(var i = 0; i < rest.length; i++){
                if(snakeX == rest[i][0] && snakeY == rest[i][1]){
                    snakeCollision = true
                }
            }
            return wallCollision || snakeCollision
        }
        this.isEatingApple = function(appleToEat){
            var head = this.body[0]
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
                return true
            }else{
                return false
            }
        }
    }

// APPLE

    function Apple(position){
        
        this.position = position
        this.draw = function(){
            ctx.save()
            ctx.fillStyle = "red"
            ctx.beginPath()
            var radius = blockSize/2
            var x = this.position[0] * blockSize + radius
            var y = this.position[1] * blockSize + radius
            ctx.arc(x, y, radius, 0, Math.PI*2, true)
            ctx.fill()
            ctx.restore()
        }
        this.setNewPosition = function(){
            var newX = Math.round(Math.random() * (widthInBlocks - 1))
            var newY = Math.round(Math.random() * (heightInBlocks - 1))
            this.position = [newX, newY]
        }
        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false

            for(var i = 0; i < snakeToCheck.body.length; i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true
                }
            }
            return isOnSnake
        }
    }

// DIRECTION

    document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;
        console.log('key: ', key);
        var newDirection;
        switch(key){
            case 37:
            newDirection = 'west';
                break;
            case 38 :
            newDirection = 'north';
                break;
            case 39:
            newDirection = 'east';
                break;
            case 40:
            newDirection = 'south';
                break;
            case 68 :
            newDirection = 'east';
                break;
            case 81 :
            newDirection = 'west';
                break;
            case 83 :
            newDirection = 'south';
                break;
            case 90 :
            newDirection = 'north';
                break;
            case 32:
                restart()
                return
            default:
                return;
        }
        snakee.setDirection(newDirection);

    }
}