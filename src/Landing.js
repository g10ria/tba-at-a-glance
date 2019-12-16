import React from 'react';

import './General.css';

let Landing = ({ comps }) => {

   return (
      <div className="container-landing">
         <img src="https://frcdesigns.files.wordpress.com/2017/06/android_launcher_icon_blue_512.png" alt="TBA Logo"/>
         <form onSubmit={submitTeam}>
            <label>
               Enter a team number:&nbsp;
               <input type="text" name="name" className="select-team"/>
            </label>
            <input type="submit" value="Submit" />
         </form>
         <div>
            OR
         </div>
         <form onSubmit={submitEvent}>
            <label>
               Select an event:&nbsp;
               <input type="text" list="comps" className="select-event"/>
            </label>
            <input type="submit" value="Submit" />
         </form>
         <div>(Events may take a few seconds to load)</div>
         <br></br>
         (all credits for team summary go to schreiaj on Github)

         <datalist id="comps">
            {comps.map((item, key) =>
               <option key={key} value={item} />
            )}
         </datalist>

      </div>
   );
}

function submitTeam(e) {
   e.preventDefault()
   window.location.href = `/tba-at-a-glance?team=${document.getElementsByClassName("select-team")[0].value}`
}

function submitEvent(e) {
   e.preventDefault()
   let selection = document.getElementsByClassName("select-event")[0].value
   window.location.href = `/tba-at-a-glance?event${selection.substring(selection.indexOf(')')+3, selection.length-1)}`
}

export default Landing;
