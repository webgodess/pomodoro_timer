// intervall variable
let myInterval = null;
let timerPaused = false;

// function that adds minutes to the current date
const AddMinutesToDate = (date, minutes) => {
  return new Date(date.getTime() + minutes);
};

// function that converts minutes to seconds
const convertToMinutesSeconds = (ms) => {
  let minutes = Math.floor(ms / 60000);
  minutes < 10 ? (minutes = "0" + minutes) : "";
  let seconds = Math.round((ms % 60000) / 1000);
  seconds < 10 ? (seconds = "0" + seconds) : "";
  let result = minutes + ":" + seconds;
  return result;
};

class SessionLength extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <section className="session-container">
          <h3 id="session-label">Session length</h3>
          <section className="button-container">
            <button
              title="increase session time"
              id="session-increment"
              onClick={this.props.incrementSession}
            >
              <i class="fa-solid fa-arrow-up"></i>
            </button>
            <h2 id="session-length">{this.props.session}</h2>
            <button
              title="decrease session time"
              id="session-decrement"
              onClick={this.props.decrementSession}
            >
              <i className="fa-solid fa-arrow-down"></i>
            </button>
          </section>
        </section>
      </>
    );
  }
}

class BreakLength extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <section className="break-container">
          <h3 id="break-label">Break length</h3>
          <section className="button-container">
            <button
              title="increase break length"
              id="break-increment"
              onClick={this.props.incrementBreak}
            >
              <i className="fa-solid fa-arrow-up"></i>
            </button>
            <h2 id="break-length">{this.props.break}</h2>
            <button
              title="decrease break length"
              id="break-decrement"
              onClick={this.props.decrementBreak}
            >
              <i className="fa-solid fa-arrow-down"></i>
            </button>
          </section>
        </section>
      </>
    );
  }
}

class TimerContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <section className="timer-container">
          <div>
            <h2 id="timer-label">{this.props.timer}</h2>
            <div>
              <h2 id="time-left" ref={this.props.timeRef}>
                {convertToMinutesSeconds(this.props.display)}
              </h2>
              <section className="buttons">
                <button
                  title="start timer"
                  id="start_stop"
                  onClick={this.props.start}
                >
                  <i
                    id="startbtn"
                    ref={this.props.playref}
                    className="fa-solid fa-play"
                  ></i>
                </button>
                <button
                  title="reset timer"
                  id="reset"
                  onClick={this.props.reset}
                >
                  <i className="fa-solid fa-arrows-rotate"></i>
                </button>
              </section>
            </div>
          </div>
        </section>
      </>
    );
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      break: 5,
      session: 25,
      timerDisplay: 1500000,
      intervalId: "",
      timerType: "Session",
      timerState: "",
    };

    //references to  DOM elements
    this.playbtnRef = React.createRef();
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

  // function to add audio and play it
  audioPlay() {
    const audio = new Audio("./assets/BeepSound.wav");
    audio.play();
  }

  // sets the duration of the break
  setBreakDuration() {
    this.setState((state) => {
      return { timerDisplay: state.break * 60000 };
    });
  }

  // sets the duration of the session
  setSessionDuration() {
    this.setState((state) => {
      return { timerDisplay: state.session * 60000 };
    });
  }

  // increments break length
  incrementBreak() {
    if (this.state.break < 30) {
      this.setState((state) => {
        return { break: state.break + 1 };
      });
      if (this.state.timerType === "Break") {
        this.setBreakDuration();
      }
    } else {
      alert("cannot set the timer longer thank 30 minutes");
    }
  }

  //decrements break length
  decrementBreak() {
    if (this.state.break > 1) {
      this.setState((state) => ({
        break: state.break - 1,
      }));
    } else {
      alert("Can't set timer under 1 minute");
    }
    if (this.state.timerType === "Break") {
      this.setBreakDuration();
    }
  }

  //increments session length
  incrementSession() {
    if (this.state.session < 60) {
      this.setState((state) => {
        return { session: state.session + 1 };
      });
      if (this.state.timerType === "Session") {
        this.setSessionDuration();
      }
    } else {
      alert("cannot set the timer longer thank 60 minutes");
    }
  }

  //decrements session length
  decrementSession() {
    if (this.state.session > 1) {
      this.setState((state) => {
        return { session: state.session - 1 };
      });
    } else {
      alert("Can't set timer under 1 minute");
    }
    if (this.state.timerType === "Session") {
      this.setSessionDuration();
    }
  }

  //resets the timer to initial settings
  handleReset() {
    myInterval = null;
    clearInterval(this.state.intervalId);
    this.setState((state) => ({
      break: 5,
      session: 25,
      timerDisplay: 1500000,
      intervalId: "",
      timerType: "Session",
    }));

    // adds and removes classes from the play button ref to toggle in between start and pause
    this.playbtnRef.current.classList.remove("fa-pause");
    this.playbtnRef.current.classList.add("fa-play");
  }

  // manages session switching logic
  sessionTimer() {
    if (this.state.timerType === "Session") {
      this.setState((state) => {
        return { timerDisplay: state.break * 60000, timerType: "Break" };
      });
      myInterval = setInterval(() => {
        this.countDown(this.state.timerDisplay);
      }, 1000);
      this.setState({ intervalId: myInterval });
    } else {
      this.setState((state) => {
        return { timerDisplay: state.session * 60000, timerType: "Session" };
      });
      myInterval = setInterval(() => {
        this.countDown(this.state.timerDisplay);
      }, 1000);
      this.setState({ intervalId: myInterval });
    }
  }

  //pauses the timer
  setPause() {
    this.playbtnRef.current.className = "fa-solid fa-pause";
    timerPaused = true;
  }

  //starts the timer
  setPlay() {
    this.playbtnRef.current.className = "fa-solid fa-play";

    timerPaused = false;
  }

  // counts down the timer, decreasing it by a second, checks the countdown for completion
  countDown = () => {
    this.setState((state) => {
      return { timerDisplay: state.timerDisplay - 1000 };
    });

    if (this.state.timerDisplay === 0) {
      clearInterval(myInterval);
      this.setState({ timerDisplay: 0 });
      this.audioPlay();
      setTimeout(this.sessionTimer, 5000);
    }
  };

  //manages the starting, pausing, and resuming of the timer by controlling the interval responsible for the countdown
  controlTimer() {
    if (myInterval === null) {
      myInterval = setInterval(() => {
        this.countDown(this.state.timerDisplay);
      }, 1000);
      this.setState({ intervalId: myInterval });
      this.setPause();
    } else {
      if (timerPaused) {
        clearInterval(myInterval);
        this.setPlay();
      } else {
        myInterval = setInterval(() => {
          this.countDown(this.state.timerDisplay);
        }, 1000);
        this.setState({ intervalId: myInterval });
        this.setPause();
      }
    }
  }

  // entry point to initiate the timer by invoking the controlTimer
  startTimer() {
    this.controlTimer();
  }

  render() {
    return (
      <div>
        <h1>Pomodoro Clock Timer</h1>
        <main className="container">
          <TimerContainer
            timer={this.state.timerType}
            display={this.state.timerDisplay}
            start={this.startTimer}
            reset={this.handleReset}
            playref={this.playbtnRef}
            timeRef={this.timeLeftref}
          />

          <section className="controls">
            <BreakLength
              incrementBreak={this.incrementBreak}
              break={this.state.break}
              decrementBreak={this.decrementBreak}
            />
            <SessionLength
              incrementSession={this.incrementSession}
              session={this.state.session}
              decrementSession={this.decrementSession}
            />
          </section>
        </main>
      </div>
    );
  }
}

ReactDOM.render(<Timer />, document.getElementById("root"));
