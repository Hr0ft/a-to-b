import { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeZone: null,
      defaultTimeZone: -180,

      selectRoute: '',

      selectTimeAtoB: '',
      selectTimeBtoA: '',
      timeInRoad: '0:50',
      ticketCount: 0,

      calculateData: {
        calculateIsOpen: false,
        totalTicketCount: 0,
        totalPrice: 0,
        startTime: '',
        endTime: '',
        totalTravelTime: '',
      },

      priceOne: 700,
      priceTwo: 1200,

      scheduleAtoB: ['18:00', '18:30', '18:45', '19:00', '19:15', '21:00'],
      scheduleBtoA: [
        '18:30',
        '18:45',
        '19:00',
        '19:15',
        '19:35',
        '21:50',
        '21:55',
      ],
    };

    this.calculate = this.calculate.bind(this);
    this.handleRouteSelect = this.handleRouteSelect.bind(this);
    this.handleTimeSelectAtoB = this.handleTimeSelectAtoB.bind(this);
    this.handleTimeSelectBtoA = this.handleTimeSelectBtoA.bind(this);
    this.handleChangeTicketCount = this.handleChangeTicketCount.bind(this);
  }

  calculate(action, ticketCount) {
    let actionTime, total, start, end;
    switch (action) {
      case 'из A в B':
        start = this.state.selectTimeAtoB;
        actionTime = this.translationTimeToMinut(this.state.timeInRoad);
        end = this.convertToHour(
          this.translationTimeToMinut(start) + actionTime
        );

        total = this.state.ticketCount * this.state.priceOne;

        this.setState({
          calculateData: {
            totalTicketCount: ticketCount,
            totalPrice: total,
            totalTravelTime: actionTime,
            startTime: start,
            endTime: end,
            calculateIsOpen: true,
          },
        });
        break;

      case 'из B в A':
        start = this.state.selectTimeBtoA;
        actionTime = this.translationTimeToMinut(this.state.timeInRoad);
        end = this.convertToHour(
          this.translationTimeToMinut(start) + actionTime
        );
        total = this.state.ticketCount * this.state.priceOne;
        this.setState({
          calculateData: {
            totalTicketCount: this.state.ticketCount,
            totalPrice: total,
            totalTravelTime: actionTime,
            startTime: start,
            endTime: end,
            calculateIsOpen: true,
          },
        });
        break;

      case 'из A в B и обратно в А':
        start = this.state.selectTimeAtoB;
        actionTime =
          this.translationTimeToMinut(this.state.timeInRoad) +
          this.translationTimeToMinut(this.state.selectTimeBtoA) -
          this.translationTimeToMinut(this.state.selectTimeAtoB);
        end = this.convertToHour(
          this.translationTimeToMinut(start) + actionTime
        );
        total = this.state.ticketCount * this.state.priceTwo;
        this.setState({
          calculateData: {
            totalTicketCount: this.state.ticketCount,
            totalPrice: total,
            totalTravelTime: actionTime,
            startTime: start,
            calculateIsOpen: true,
            endTime: end,
          },
        });
        break;

      default:
        return this.setState({
          calculateData: {
            totalTicketCount: 0,
            totalPrice: 0,
            totalTravelTime: 0,
            startTime: 0,
            calculateIsOpen: false,
          },
        });
    }
  }

  handleChangeTicketCount(e) {
    this.setState({
      ticketCount: e.target.value,
    });
  }

  handleRouteSelect(e) {
    this.setState({ selectRoute: e.target.value });
  }

  handleTimeSelectAtoB(e) {
    this.setState({ selectTimeAtoB: e.target.value });
  }
  handleTimeSelectBtoA(e) {
    if (this.state.selectRoute === 'из B в A' && this.state.selectTimeAtoB) {
      this.setState({ selectTimeAtoB: '' });
    } else {
      this.setState({ selectTimeBtoA: e.target.value });
    }
  }

  translationTimeToMinut(time) {
    let splitTime = time.split(':');
    const sixtySeconds = 60;
    return parseInt(splitTime[0] * sixtySeconds + parseInt(splitTime[1]));
  }
  translationMinutToHour(time) {
    let hour = Math.floor(time / 60);
    let minute = time % 60;
    return (
      <p>
        {hour > 0 ? hour + ' часов' : null} {minute} минут
      </p>
    );
  }
  convertTimeZone(time, defultZone, curentZone) {
    return time + defultZone - curentZone;
  }

  convertToHour(time) {
    let hour = Math.floor(time / 60);

    let minute = time % 60;
    let totalMinute;
    if (minute === 0) {
      totalMinute = '00';
    } else if (minute < 10) {
      totalMinute = '0'.concat(minute);
    } else {
      totalMinute = minute;
    }

    let result = ''.concat(hour).concat(':').concat(totalMinute);

    return result;
  }

  convertToHourDiv(time) {
    let result = this.convertToHour(time);
    return <>{result}</>;
  }

  getTimeZone() {
    let time = new Date();
    this.setState({
      timeZone: time.getTimezoneOffset(),
    });
  }

  showResultTime(time, defaultTimeZone, currentTimeZone) {
    return this.convertToHour(
      this.convertTimeZone(
        this.translationTimeToMinut(time),
        defaultTimeZone,
        currentTimeZone
      )
    );
  }
  componentDidMount() {
    this.getTimeZone();
  }
  render() {
    let AtoB = this.state.scheduleAtoB;
    let BtoA = this.state.scheduleBtoA;

    let defaultTimeZone = this.state.defaultTimeZone;
    let currentTimeZone = this.state.timeZone;

    const AtoBList = AtoB.map((time) => {
      let thisTime = this.translationTimeToMinut(time);

      let actualTime = this.convertToHourDiv(
        this.convertTimeZone(thisTime, defaultTimeZone, currentTimeZone)
      );

      return (
        <option value={time} key={time}>
          {actualTime} из A в B
        </option>
      );
    });

    const BtoAList = BtoA.map((time) => {
      let thisTime = this.translationTimeToMinut(time);

      let actualTime = this.convertToHourDiv(
        this.convertTimeZone(thisTime, defaultTimeZone, currentTimeZone)
      );

      let selectedTime =
        this.translationTimeToMinut(this.state.selectTimeAtoB) +
        this.translationTimeToMinut(this.state.timeInRoad);

      if (thisTime > selectedTime || this.state.selectTimeAtoB === '') {
        return (
          <option value={time} key={time}>
            {actualTime} из В в А
          </option>
        );
      } else return null;
    });

    return (
      <div
        style={{
          width: '500px',
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <p>Выбирите направление:</p>
        <select name="route" id="route" onClick={this.handleRouteSelect}>
          <option value="из A в B">из A в B</option>
          <option value="из B в A">из B в A</option>
          <option value="из A в B и обратно в А">из A в B и обратно в А</option>
        </select>
        <div
          style={{ width: '200px', height: '80px', backgroundColor: 'GRAY' }}
        >
          <p>Направлеине: </p>
          {this.state.selectRoute ? this.state.selectRoute : 'не выбрано'}
        </div>
        <hr style={{ border: '1px solid blue', width: '100%' }} />

        {this.state.selectRoute === 'из A в B' ? (
          <select name="time" id="time" onClick={this.handleTimeSelectAtoB}>
            {AtoBList}
          </select>
        ) : this.state.selectRoute === 'из B в A' ? (
          <select name="time" id="time" onClick={this.handleTimeSelectBtoA}>
            {BtoAList}
          </select>
        ) : this.state.selectRoute === 'из A в B и обратно в А' ? (
          <div>
            <select name="time" id="time" onClick={this.handleTimeSelectAtoB}>
              {AtoBList}
            </select>
            <select name="time" id="time" onClick={this.handleTimeSelectBtoA}>
              {BtoAList}
            </select>
          </div>
        ) : null}

        <div
          style={{ border: '1px solid red', width: '500px', height: '100px' }}
        >
          <label htmlFor="num">Количество билетов</label>
          <input
            type="number"
            id="num"
            onChange={this.handleChangeTicketCount}
          ></input>
          <button
            onClick={() =>
              this.calculate(this.state.selectRoute, this.state.ticketCount)
            }
          >
            Посчитать
          </button>
        </div>
        {this.state.calculateData.calculateIsOpen ? (
          <div>
            <p>
              Билетов выбрано: {this.state.calculateData.totalTicketCount}, по
              маршруту "{this.state.selectRoute}" стоимостью{' '}
              {this.state.calculateData.totalPrice}
            </p>
            <div>
              Это путешествие займет у вас:{' '}
              {this.translationMinutToHour(
                this.state.calculateData.totalTravelTime
              )}
            </div>
            <p>
              Теплоход отправляется в{' '}
              {this.showResultTime(
                this.state.calculateData.startTime,
                defaultTimeZone,
                currentTimeZone
              )}{' '}
              а прибудет в{' '}
              {this.showResultTime(
                this.state.calculateData.endTime,
                defaultTimeZone,
                currentTimeZone
              )}
            </p>
          </div>
        ) : null}
      </div>
    );
  }
}

export default App;
