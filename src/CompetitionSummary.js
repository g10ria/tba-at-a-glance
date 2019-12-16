import React from 'react';

import './General.css';

let CompetitionSummary = ({ teams }) => {

   return (
      <div className="container-compsummary">
         <span className="competition-content">

            <span className="heading">All teams in competition</span>
            <br></br>
            <span>(click team to see summary)</span>
            <br></br>
            <br></br>

            {teams.map((t) => {
               return (<span key={t} className="team" onClick={() => handleClick(t)}>{t}, </span>);
            })}

            <br></br>
            <br></br>
            <span>Selected team: </span>
            <span className="selectedTeam"></span>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <form onSubmit={returnToLanding}>
               <input type="submit" value="Back" />
            </form>

         </span>
         

         <iframe className="iframe" title="Team Summary" src="" width="540" height="450"></iframe>
            
      </div>
      
   );
}

function returnToLanding() {
   window.location.href="/"
}

function handleClick(t) {
   document.getElementsByClassName("iframe")[0].src = `/tba-at-a-glance?team=${t}`
   document.getElementsByClassName("selectedTeam")[0].innerHTML = t
}

export default CompetitionSummary;
