import './App.css';
import React,{useState} from 'react'

import keys from "./assets/keys.jpg";
import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
import { useCopyToClipboard } from 'usehooks-ts'
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex',width: '400px',height:'10px', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};



function App() {

  // password length
  const key = [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
  const list = key.map((keys)=><option value={keys}>{keys}</option>)

  const [pwdDetails, setPwdDetails] = useState({
      length:"5",
      symbol:true,
      number:true,
      lowerCase:true,
      upperCase:true,
      similarChar:false,
      ambiguousChar:false,

    })
    const [poll, setPoll] = useState("!@#$%^&*[]/()~,;:.1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    const [strength, setStrength] = useState(0);
    const [copyText, setCopyText] = useCopyToClipboard();
    const [passwordG, setPasswordG] = useState("");

    //Calculate number of occuring in string 
    const countChar=(str) => {
      const map={}
      str.split("").forEach(e =>{
        map[e]=map[e]?map[e]+1:1;
      } );

      let max=1;
      let char=str[0];
      for(let k in map)
      {
        if(map[k] > max)
        {
          max=map[k];
          char=k;
        }
      }
      // console.log("Max value is : ", max);
      return max;
    } 

    //Calculate Strength of the password with entropy calculation
    const calStrength = (text,password) => {
      let poll = text.length;
      let passLength = password.length;
      let entropy;
      // console.log("Math:", Math.log(2));
      let count = countChar(password);
      // count*=0.1;
      if(passLength<9)
      {
        if(count>4)
        {
          count*=Math.pow(10,-(count.toString().length));
          // count = 1.1-count;
          console.log("Count =>",count);
          poll-=count;
          console.log("Poll =>",poll);
        }
      }
      else{
        count*=Math.pow(10,-(count.toString().length));
          // count = 1.1-count;
          console.log("Count =>",count);
          poll*=count;
          console.log("Poll =>",poll);
      }
      entropy=(passLength * Math.log2(poll));
      console.log("Entropy = ", entropy);
      
      // console.log("count",count);
      // if(count > 1)
      //  { 
      //   count*=0.01;
      //   count=0.11-count;
      // }
      // else{
      //   count= 1.1-count;
      // }
      
      // console.log("Count after 1.1:",count);
      // if(count === 0)
      //   entropy*=1.25;
      // else
      //   entropy*=count;
      //Calculation => E = Password Length * log(size of pool)
      
      // entropy*=1.25;
      
      if(entropy > 100)
      {
        entropy = 100;
      }
      setStrength(entropy);
      // console.log("Entropy = ", entropy);
    }
    
    //Handle Change in the input of new password 
    const handleChange = (e) => {
      // setPasswordG(e.target.value);
      let passWrite="";
      passWrite=e.target.value;
      // console.log("HandleChange => ", passWrite);
      setPasswordG(passWrite);
      // console.log("HandleChange password => ", poll);
      calStrength(poll,passWrite);
    }

    //handle change in checkboxes 
    const handleClick = e => {
      const { name, value } = e.target;
      setPwdDetails(prevState => ({
          ...prevState,
          [name]: JSON.parse(value)
      }));
    }

    //handle change in password length
    const handlePass = e => {
      const { name, value } = e.target;
      setPwdDetails(prevState => ({
          ...prevState,
          [name]: value
      }));
    }
//Removing elements from the string
  const removePass = (pass,name) => {
    for (let char of name){
      pass = pass.split(char).join('');
    }
    return pass;
  }


//Copy the text to the clipboard  
const OnCopy = () =>
{
  setCopyText(passwordG);
}

//Generating pass string for password generation
const generatePassword = (detKeys) =>
{
    let lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    let upperCase = lowerCase.toUpperCase();
    let symbol = '!@#$%^&*[]/()~,;:.';
    let similarChar = 'il1Lo0O';
    let number = '1234567890';
    let ambiguousChar = `[]/()'~,;:.`;
    let arr=['10',symbol,number,lowerCase,upperCase,similarChar,ambiguousChar];
    
    let pass="";
    // console.log("details are as => ",details);
    // console.log("Keys are as => ",detKeys);

    for(let i=1;i<7;i++)
    {
      if(detKeys[i])
      {
          if((i===5) || (i===6)){
          pass = removePass(pass,arr[i])
          }
          else{
          pass+=arr[i];
          }
      }
      
    }
    
    randomPassword(pass);
    // console.log("Pass at generate:",pass);

}

//Creating random password from the pass string
const randomPassword = (pass) =>{

  let password="";
    for(let i=0;i<pwdDetails.length;i++)
      {
        let randompass = Math.floor(Math.random()* pass.length);
        password += pass.substring(randompass,randompass+1);
      
      }
      setPasswordG(password);
      // console.log(passwordG);
      // let textInput = document.getElementById("pwd-generation");
      // textInput.value = password;
    // console.log("Password :",password);
    setPoll(pass);
    let btn = document.getElementById("pwd-generation");
    btn.value = password;
    // console.log("Pass =",pass);
    calStrength(pass,password);
    

}

// Converting the object into array 
const generate =() => {

  // console.log("pwdDetails: ", pwdDetails);  
    let psdValues=Object.values(pwdDetails);
    // console.log("psdValues: ", psdValues);
    // let psdKeys=Object.keys(pwdDetails);
    generatePassword(psdValues);

  }
  return (
    <div className="App">
      <div className='app-section'>
      <div className='app-header'>
        <img src={keys} alt='Keys' width={100}/>
        <p style={{fontFamily:"cursive",fontSize:"25px" }}>Secure Password Generator</p>
      </div>
      <div className='app-working'>
        {/* <p>Working of Password Generation</p> */}
        {/* <br/> */}

        {/* Password Length  */}
        <div className='input-block'>
          <p className='input-label'>Password Length</p>
          <select name="length" className='input-field' id="pwd-length" onClick={handlePass}>
          <optgroup label='Strong'>
           {list}
          </optgroup>
          </select>
        </div>
        {/* Included Symbols  */}
        {/* <div className='input-block'>
          <p className='input-label'>Include Symbols:</p>
          <div name="password" className='input-field' >
          <label>
            <input type="checkbox"disabled name="symbol" value={!pwdDetails.symbol} onClick={handleClick}/>( e.g. @#$%)
          </label>
          </div>
        </div> */}
        {/* Include Numbers  */}
        {/* <div className='input-block'>
          <p className='input-label'>Include Numbers:</p>
          <div name="password" className='input-field' >
          <label>
            <input type="checkbox" disabled name="number" value={!pwdDetails.number} onClick={handleClick} />( e.g. 123456)
          </label>
          </div>
        </div> */}
          {/* Include Lowercase Characters  */}
        {/* <div className='input-block'>
          <p className='input-label'>Include Lowercase Characters:</p>
          <div name="password" className='input-field' >
          <label>
            <input type="checkbox" disabled name="lowerCase" value={!pwdDetails.lowerCase} onClick={handleClick} />( e.g. abcdef)
          </label>
          </div>
        </div> */}
        {/* Include Uppercase Characters */}
        {/* <div className='input-block'>
          <p className='input-label'>Include Uppercase Characters:</p>
          <div name="password" className='input-field' >
          <label>
            <input type="checkbox" disabled name="upperCase" value={!pwdDetails.upperCase} onClick={handleClick} />( e.g. ABCDEF)
          </label>
          </div>
        </div> */}
        {/* Exclude Similar Characters  */}
        {/* <div className='input-block'>
          <p className='input-label'>Exclude Similar Characters:</p>
          <div name="password" className='input-field' >
          <label>
            <input type="checkbox" disabled name="similarChar" value={!pwdDetails.similarChar} onClick={handleClick} />( e.g.  i, l, 1, L, o, 0, O)
          </label>
          </div>
        </div> */}
        {/* Exclude Ambiguous Characters  */}
        {/* <div className='input-block'>
          <p className='input-label'>Exclude Ambiguous Characters:</p>
          <div name="password" className='input-field'>
          <label>
            <input type="checkbox" disabled name="ambiguousChar" value={!pwdDetails.ambiguousChar} onClick={handleClick} />( { } [ ] ( ) / \ ' " ` ~ , ; : . < ></>)
          </label>
          </div>
        </div> */}
        

        {/* Generate Password Button */}
        <div className='button' >
          <Button variant="outlined" id="generate-btn" onClick={generate}>Generate Password</Button>
        </div>

        <br/>
        <br/>

        {/* New Password Generation */}
        <div className='input-block'>
          <p className='input-label'>Your New Password:</p>
          <div name="password" className='input-field'>
          <label style={{display:"flex",justifyContent:"space-around",}}>
            <input id="pwd-generation"  type="text" onChange={handleChange} variant="outlined"  defaultValue={passwordG} />
            <Button variant="outlined" id="copy" style={{margin:"0px 0px 0px 5px"}} onClick={OnCopy}>Copy</Button>
          </label>
          </div>
        </div>

        {/* Password Strength Modal */}
        <div className='input-block'>
          <p className='input-label'>New Password Strength:</p>
          <div name="password" className='input-field'>
          <label style={{display:"flex",justifyContent:"space-around",}}>
          <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel id="linearprogress" value={strength} />
          </Box>
            {/* <progress min={0} max={100} value={strength}>{strength} value</progress>  */}
          </label>
          </div>
        </div>

      
      </div>
      </div>
    </div>
  );
}

export default App;
