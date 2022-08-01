class Dispatcher {
    constructor(target, updater) {
        this.target = target;
        this.updater = updater;
    }
    addClickable(button, row, col) {
        button.onclick = () => {
            this.target.defuse(row, col);
            this.updater();
        };
        button.oncontextmenu = (event) => {
            event.preventDefault();
            this.target.toggleFlag(row, col);
            this.updater();
        };
    }
}
export default Dispatcher;
