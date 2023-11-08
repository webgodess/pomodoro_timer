let x = null;

const AddMinutesToDate = (date, minutes) => {
  return new Date(date.getTime() + minutes);
};
let TimerPaused = false;
const toMinutes_Seconds = (ms) => {
  let minutes = Math.floor(ms / 60000);
  minutes < 10 ? (minutes = "0" + minutes) : "";
  let seconds = Math.round((ms % 60000) / 1000);
  seconds < 10 ? (seconds = "0" + seconds) : "";
  let result = minutes + ":" + seconds;
  return result;
};

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      break: 5,
      session: 25,
      timerInit: 1500000,
      intervalId: "",
      timerType: "Session",
      timerState: "",
    };

    this.playbtnRef = React.createRef();
    this.audioRef = React.createRef();
    this.timeLeftref = React.createRef();

    this.incrementBreak = this.incrementBreak.bind(this);
    this.decrementBreak = this.decrementBreak.bind(this);
    this.incrementSession = this.incrementSession.bind(this);
    this.decrementSession = this.decrementSession.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.sessionTimer = this.sessionTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.controlTimer = this.controlTimer.bind(this);
  }

  audioPlay() {
    this.audioRef.current.play();
  }

  audioPause() {
    this.audioRef.current.pause();
  }

  incrementBreak() {
    let i = this.state.break;
    if (i < 60) {
      this.setState((state) => {
        return { break: state.break + 1 };
      });
      if (this.state.timerType === "Break") {
        this.setState((state) => {
          return { timerInit: state.break * 60000 };
        });
      }
    } else {
      console.log("the maximum amount of time is 60 minutes");
    }
  }
  decrementBreak() {
    let i = this.state.break;
    if (i > 1) {
      this.setState((state) => ({
        break: state.break - 1,
      }));
    } else {
      console.log("timer can't be less than a minute");
    }
    if (this.state.timerType === "Break") {
      this.setState((state) => {
        return { timerInit: state.break * 60000 };
      });
    }
  }
  incrementSession() {
    let i = this.state.session;

    if (i < 60) {
      this.setState((state) => {
        return { session: state.session + 1 };
      });
      if (this.state.timerType === "Session") {
        this.setState((state) => {
          return { timerInit: state.session * 60000 };
        });
      }
    } else {
      console.log("the maximum amount of time is 60 minutes");
    }
  }
  decrementSession() {
    let i = this.state.session;
    if (i > 1) {
      this.setState((state) => {
        return { session: state.session - 1 };
      });
    } else {
      console.log("timer can't be less than a minute");
    }
    if (this.state.timerType === "Session") {
      this.setState((state) => {
        return { timerInit: state.session * 60000 };
      });
    }
  }
  handleReset() {
    x = null;
    clearInterval(this.state.intervalId);
    this.setState((state) => ({
      break: 5,
      session: 25,
      timerInit: 1500000,
      intervalId: "",
      timerType: "Session",
    }));
    this.audioPause();
    this.audioRef.current.currentTime = 0;
    this.playbtnRef.current.classList.remove("fa-pause");
    this.playbtnRef.current.classList.add("fa-play");
  }

  setBreak() {
    this.setState((state) => {
      return { timerInit: state.break * 60000, timerType: "Break" };
    });
  }

  setSession() {
    this.setState((state) => {
      return { timerInit: state.session * 60000, timerType: "Session" };
    });
  }

  sessionTimer() {
    if (this.state.timerType === "Session") {
      this.setBreak();
      this.startCountDown();

      this.setState({ intervalId: x });
    } else {
      this.setSession();
      this.startCountDown();
    }
  }

  audioPause() {
    this.playbtnRef.current.className = "fa-solid fa-pause";
    TimerPaused = true;
  }

  audioPlay() {
    this.playbtnRef.current.className = "fa-solid fa-play";
    TimerPaused = false;
  }

  countDown = () => {
    this.setState((state) => {
      return { timerInit: state.timerInit - 1000 };
    });

    if (this.state.timerInit === 0) {
      clearInterval(x);
      this.timeLeftref.current.innerHTML = "00:00";
      this.audioPlay();
      setTimeout(this.sessionTimer, 5000);
    }
  };

  startCountDown() {
    x = setInterval(() => {
      this.countDown(this.state.timerInit);
    }, 1000);
    this.setState({ intervalId: x });
  }

  controlTimer() {
    if (x === null) {
      this.startCountDown();
      this.audioPause();
    } else {
      if (TimerPaused) {
        clearInterval(x);
        this.audioPlay();
      } else {
        this.startCountDown;
        this.audioPause();
      }
    }
  }

  startTimer() {
    this.controlTimer();
  }

  render() {
    return (
      <div>
        <h1>Pomodoro Clock Timer</h1>
        <main className="container">
          <section className="timer-container">
            <div>
              <h2 id="timer-label">{this.state.timerType}</h2>
              <div>
                <h2 id="time-left" ref={this.timeLeftref}>
                  {toMinutes_Seconds(this.state.timerInit)}
                </h2>
                <section className="buttons">
                  <button id="start_stop" onClick={this.startTimer}>
                    <i
                      id="startbtn"
                      ref={this.playbtnRef}
                      className="fa-solid fa-play"
                    ></i>
                  </button>
                  <button id="reset" onClick={this.handleReset}>
                    <i className="fa-solid fa-arrows-rotate"></i>
                  </button>
                </section>
              </div>
            </div>
          </section>
          <section className="controls">
            <section className="break-container">
              <h3 id="break-label">Break length</h3>
              <section className="button-container">
                <button id="break-increment" onClick={this.incrementBreak}>
                  <i className="fa-solid fa-arrow-up"></i>
                </button>
                <h2 id="break-length">{this.state.break}</h2>
                <button id="break-decrement" onClick={this.decrementBreak}>
                  <i className="fa-solid fa-arrow-down"></i>
                </button>
              </section>
            </section>
            <section className="session-container">
              <h3 id="session-label">Session length</h3>
              <section className="button-container">
                <button id="session-increment" onClick={this.incrementSession}>
                  <i className="fa-solid fa-arrow-up"></i>
                </button>
                <h2 id="session-length">{this.state.session}</h2>
                <button id="session-decrement" onClick={this.decrementSession}>
                  <i className="fa-solid fa-arrow-down"></i>
                </button>
              </section>
            </section>
            <audio
              preload="auto"
              src="./assets/BeepSound.wav"
              id="beep"
              ref={this.audioRef}
            ></audio>
          </section>
        </main>
      </div>
    );
  }
}

ReactDOM.render(<Timer />, document.getElementById("root"));
