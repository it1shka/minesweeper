import Minesweeper from "./minespeeper.js";

class Dispatcher {
  constructor(
    private target: Minesweeper,
    private updater: Function
  ) {}

  public addClickable(button: HTMLElement, row: number, col: number) {
    button.onclick = () => {
      this.target.defuse(row, col)
      this.updater()
    }

    button.oncontextmenu = (event) => {
      event.preventDefault()
      this.target.toggleFlag(row, col)
      this.updater()
    }
  }


}

export default Dispatcher