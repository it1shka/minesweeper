import { getRandomAndRemove, initMatrix, positionsContain, removePosition } from './utils.js'

export type Position = [number, number]

class Minesweeper {

  private bombs: Array<Position> = []
  private flags: Array<Position> = []
  private countmap: number[][]
  private fog: boolean[][]
  private isDead = false
  private won = false

  constructor(
    private readonly size: number,
    private readonly bombPercentage: number
  ) {
    this.generateBombs()
    this.countmap = initMatrix(this.size, 0)
    this.setupCountmap()
    this.fog = initMatrix(this.size, true)
  }

  private generateAllPositions() {
    const output: Array<Position> = []
    for(let row = 0; row < this.size; row++) {
      for(let col = 0; col < this.size; col++) {
        const pos: Position = [row, col]
        output.push(pos)
      }
    }
    return output
  }

  private generateBombs() {
    const mapSize = this.size ** 2
    const bombsAmount = Math.round(mapSize * this.bombPercentage / 100)
    const freePositions = this.generateAllPositions()

    for(let i = 0; i < bombsAmount; i++) {
      const bomb = getRandomAndRemove(freePositions)
      this.bombs.push(bomb)
    }
  }

  private setupCountmap() {
    for(const [brow, bcol] of this.bombs) {

      for(let row = brow - 1; row <= brow + 1; row++) {
        for(let col = bcol - 1; col <= bcol + 1; col++) {
          if(row < 0 || row >= this.size || col < 0 || col >= this.size) continue

          this.countmap[row][col]++
        }
      }

    }
  }

  public toggleFlag(row: number, column: number) {
    if(this.isDead || this.won) return
    if(!this.fog[row][column]) return

    const pos: Position = [row, column]
    if(positionsContain(this.flags, pos)) {
      removePosition(this.flags, pos)
    } else {
      this.flags.push(pos)
    }
  }

  public defuse(row: number, column: number) {
    if(this.isDead || this.won) return
    if(!this.fog[row][column]) return
    if(positionsContain(this.flags, [row, column])) return
    if(positionsContain(this.bombs, [row, column])) {
      this.fog[row][column] = false
      this.isDead = true
      return
    }

    const visited: Position[] = [[row, column]]
    const queue: Position[] = [[row, column]]

    while(queue.length > 0) {
      const [row, col] = queue.shift()!
      this.fog[row][col] = false
      if(this.countmap[row][col] > 0) continue

      for(let r = row - 1; r <= row + 1; r++) {
        for(let c = col - 1; c <= col + 1; c++) {
          if(r < 0 || c < 0 || r >= this.size || c >= this.size)
            continue
          
          if(positionsContain(visited, [r, c])) continue

          visited.push([r, c])
          queue.push([r, c])
        }
      }
    }
  }

  public get exploded() {
    return this.isDead
  }

  public get defused() {
    if(this.won) return true
    return (this.won = this.checkWin())
  }

  private checkWin() {
    for(const bomb of this.bombs) {
      if(!positionsContain(this.flags, bomb)) {
        return false
      }
    }
    return this.flags.length === this.bombs.length
  }

  public renderTo(display: HTMLElement) {
    const cells = display.children

    for(let row = 0; row < this.size; row++) {
      for(let col = 0; col < this.size; col++) {

        const cell = cells[row * this.size + col]
        const tag = ((): string | number => {
          switch(true) {
            case positionsContain(this.flags, [row, col]): return 'flag'
            case this.fog[row][col]: return 'fog'
            case positionsContain(this.bombs, [row, col]): return 'bomb'
            default: return this.countmap[row][col]
          }
        })()

        if(typeof tag === 'string') {
          cell.className = tag
        } else {
          cell.classList.remove('fog')
          if(tag > 0) cell.textContent = String(tag)
        }

      }
    }

  }
  
}

export default Minesweeper