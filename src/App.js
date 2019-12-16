import React, { Component } from 'react';
import './App.css';
import Config from './config';
import HistorySummary from './HistorySummary';
import CompetitionSummary from './CompetitionSummary';
import Landing from './Landing';


class App extends Component {

  constructor(...args) {
    super(...args);
    let urlParams = new URLSearchParams(window.location.search);
    this.state = {
      team: urlParams.get('team'),
      competition: urlParams.get('eventkey'),
      competitions:[],  // all competitions from the min year
      teams: [],  // teams in a selected competition
      events: [], // all events (competitions) for a team lol
      eventResults: {}, // results for said events
      error: false,  // to display the error page or not
      landing: false, // to display the landing page or not
      showCompetition: false   // to display the competition summary page or not
    }
  }

  async componentDidMount() {
    let team = this.state.team;
     let competition = this.state.competition
    let headers = {
      'X-TBA-Auth-Key': Config.TBA_KEY
    }
    
     if (team == null && competition==null) {
        this.setState({ landing: true })
        this.setState({showCompetition: false})

      try {
         let allComps = []
         let year = Config.MIN_YEAR;
         let thisYear = new Date().getFullYear()
         while (year<=thisYear) {
            let compsResponse = await fetch(`${Config.BASE_URL}/events/${year}/simple`, { headers })
            let comps = await compsResponse.json()
            for(let i=0;i<comps.length;i++) {
               allComps.push(`${comps[i].name} (${comps[i].year}) (key=${comps[i].key})`)
            }
            year++
         }
         allComps.sort((a,b) => {
            return a.name - b.name
         })

         this.setState({competitions: allComps})
         
      } catch(e) {
         console.error(e)
         this.setState({error: true})
      }      

    } else if (competition==null) {
       this.setState({landing: false})
       this.setState({showCompetition: false})

       try {

          let eventsResponse = await fetch(`${Config.BASE_URL}/team/frc${team}/events/simple`, { headers })
          let events = await eventsResponse.json();
          events = events.filter((e) => Config.EVENT_TYPES.indexOf(e.event_type) >= 0 && e.year >= Config.MIN_YEAR)
          events.map(async (e) => {
             let resultsRes = await fetch(`${Config.BASE_URL}/team/frc${team}/event/${e.key}/status`, { headers })
             let eventResults = await resultsRes.json();
             let allEventResults = this.state.eventResults;
             allEventResults[e.key] = { ...e, ...eventResults };
             this.setState({ eventResults: allEventResults });
          })

          this.setState({events})
       }
       catch (e) {
          console.error(e)
          this.setState({ error: true })
       }

    } else {   // show competition display
      this.setState({landing: false})
        this.setState({ showCompetition: true})

      try {
         let teamsInComp = await fetch(`${Config.BASE_URL}/event/${competition}/teams/keys`, { headers })
         let teams = await teamsInComp.json();

         for(let i=0;i<teams.length;i++) {
            teams[i] = teams[i].substring(teams[i].indexOf("frc")+3)
         }

         this.setState({teams})
      }
      catch (e) {
         console.error(e);
         this.setState({error: true})
      }

    }

  }

  render() {
    return (
      <div className="App">
        {this.state.error ? 
            <Error {...this.state}/> : 
            this.state.landing ?
                <Landing comps={this.state.competitions}/> :
                this.state.showCompetition ?
                  <CompetitionSummary teams={this.state.teams}/> :
                  <HistorySummary events={this.state.events} team={this.state.team} eventResults={this.state.eventResults} />
            
            }
      </div>
    );
  }
}

let Error = ({team}) =>
  <div>Something went wrong</div>


export default App;
