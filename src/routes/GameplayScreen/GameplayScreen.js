import React, { Component } from 'react';
import config from '../../config';
import AlienList from '../../components/AlienList/AlienList';
import StructureList from '../../components/StructureList/StructureList';
import AlienSpawner from '../../components/AlienSpawner/AlienSpawner';
import StructureConstructor from '../../components/StructureConstructor/StructureConstructor';
import Tasks from '../../components/Tasks/Tasks';
import './GameplayScreen.css';

class GameplayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disableButtons: false,
      spawnMode: false,
      constructMode: false,
      taskMode: false,
      status: [],
      aliens: [],
      structures: [],
    };
  };


  //GET OUR DATABASES
  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/status`)
    ])
      .then(([statusRes]) => {
        if (!statusRes.ok)
          return statusRes.json().then(event => Promise.reject(event))
        return Promise.all([
          statusRes.json(),
        ])
      })
      .then(([status]) => {
        this.setState({ status })
      })
      .catch(error => {
        console.log({error})
      })

    Promise.all([
      fetch(`${config.API_ENDPOINT}/aliens`)
    ])
      .then(([aliensRes]) => {
        if (!aliensRes.ok)
          return aliensRes.json().then(event => Promise.reject(event))
        return Promise.all([
          aliensRes.json(),
        ])
      })
      .then(([aliens]) => {
        this.setState({ aliens })
      })
      .catch(error => {
        console.log({error})
      })

      Promise.all([
        fetch(`${config.API_ENDPOINT}/structures`)
      ])
        .then(([structuresRes]) => {
          if (!structuresRes.ok)
            return structuresRes.json().then(event => Promise.reject(event))
          return Promise.all([
            structuresRes.json(),
          ])
        })
        .then(([structures]) => {
          this.setState({ structures })
        })
        .catch(error => {
          console.log({error})
        })
  };

  //CHANGING THE CONDITIONALS
  handleChangeCondition(changing) {
    if (changing === 'spawning') {
      this.setState({disableButtons: true});
      this.setState({spawnMode: true});
      this.setState({constructMode: false});
    } else if (changing === 'constructing') {
      this.setState({disableButtons: true});
      this.setState({spawnMode: false});
      this.setState({constructMode: true});
    } else if (changing === 'tasks') {
      this.setState({disableButtons: true});
      this.setState({spawnMode: false});
      this.setState({constructMode: false});
      this.setState({taskMode: true});
    } else if (changing === 'cancel') {
      this.setState({disableButtons: false});
      this.setState({spawnMode: false});
      this.setState({constructMode: false});
      this.setState({taskMode: false});
    } else {
      alert('check your conditionals');
    };
  };

  handleClickSpawner = () => {
    let changing = 'spawning';
    this.handleChangeCondition(changing);
  };

  handleClickConstructor = () => {
    let changing = 'constructing';
    this.handleChangeCondition(changing);
  };

  handleClickTasks = () => {
    let changing = 'tasks';
    this.handleChangeCondition(changing);
  };

  handleClickCancel = () => {
    let changing = 'cancel';
    this.handleChangeCondition(changing);
  };

  //UPDATE PLAYER STATUS
  setSpawns = (toSpawn) => {
    this.setState( prevState => {
      let toSpawnAlien = prevState.aliens.find(alien => alien.alien_name === 'Worker Drone')
        toSpawnAlien.spawning_count = toSpawn;
        return {
          aliens: [toSpawnAlien]
        }
      })
    this.handleClickCancel();
  };

  finalSpawning = (spawning) => {
    this.setState( prevState => {
      let spawningAlien = prevState.aliens.find(alien => alien.alien_name === 'Worker Drone')
        console.log(spawning)
        spawningAlien.brood_count = spawning;
        return {
          aliens: [spawningAlien]
        }
      })
    this.handleClickCancel();
  };

  //RENDERING FUNCTIONS
  renderSpawnerButton() {
    if (this.state.disableButtons === true) {
      return (<button className='build-aliens-button' disabled>Spawn Aliens</button>);
    } else {
      return (<button className='build-aliens-button' onClick={() => this.handleClickSpawner()}>Spawn Aliens</button>);
    };
  };

  renderConstructorButton() {
    if (this.state.disableButtons === true) {
      return (<button className='build-structures-button' disabled>Build Alien Stuctures</button>);
    } else {
      return (<button className='build-structures-button' onClick={() => this.handleClickConstructor()}>Build Alien Stuctures</button>);
    };
  };

  renderTaskButton() {
    if (this.state.disableButtons === true) {
      return (<button className='task-button' disabled>Set Tasks</button>)
    } else {
      return (<button className='task-button' onClick={() =>  this.handleClickTasks()}>Set Tasks</button>);
    };
  };

  renderBuilders() {
    if (this.state.spawnMode === true) {
      return (
        <AlienSpawner aliens={this.state.aliens} setSpawns={this.setSpawns}
          handleClickCancel={this.handleClickCancel}
        />
      );
    } else if (this.state.constructMode === true) {
      return (
        <StructureConstructor structures={this.state.structures} handleClickConstruct={this.handleClickConstruct} 
          handleClickCancel={this.handleClickCancel}
        />
      );
    } else if (this.state.taskMode === true) {
      return (
        <Tasks status={this.state.status} aliens={this.state.aliens} finalSpawning={this.finalSpawning}
          handleClickSpawner={this.handleClickSpawner} handleClickConstructor={this.handleClickConstructor} 
            handleClickCancel={this.handleClickCancel} handleClickCommit={this.handleCommitTasks}/>
      );
    } else {
      return
    }
  };

  //MAIN RENDER
  render() {
    const { status, aliens, structures } = this.state

    return (
      <div>
        {status.map(report => (
          <header className='status-bar'>
            <span className='left'>
              <h4>Biomass: {report.biomass}</h4>
            </span>
            <span className='center'>
              <h3>Brood Name: {report.brood_name}</h3>
            </span>
            <span className='right'>
              <h4>Synapse: {report.synapse}</h4>
            </span>
          </header>
        ))}
        <section className='gameplay-style reaction-mode'>
          <div className='left aliens-box'>
          <h2>Aliens</h2>
            <AlienList aliens={aliens} status={status} />
            <span>{this.renderSpawnerButton()}</span>
          </div>
          <div className='right alien-structures-box'>
            <h2>Structures</h2>
              <StructureList structures={structures} />
              <span>{this.renderConstructorButton()}</span>
          </div>
          <div>{this.renderBuilders()}</div>
        </section>
        <footer>{this.renderTaskButton()}</footer>
      </div>
    )
  };
};

export default GameplayScreen;