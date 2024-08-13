import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from 'react-toastify';




interface SleepProps {
    setShowSleepPopup: React.Dispatch<React.SetStateAction<boolean>>;
  }

const sleepPopup: React.FC<SleepProps> = ({ setShowSleepPopup }) => {
    const color = '#ffc20e'
  
  
    const [date, setDate] = React.useState<any>(dayjs(new Date()))
    const [time, setTime] = React.useState<any>(dayjs(new Date()))
    const [calorie, setCalorie] = React.useState<any>(0);
  
     const [sleep, setSleep]=React.useState<any>({
        date:'',
        durationInHrs:''
     });
  
     const [items, setItems]=React.useState<any>([]);
    
       const goalcalorie=()=>{
            
     fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/getgoalcalorieintake', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
         
      },
      
      credentials: 'include'
  })
  
  .then(res => res.json())
      .then(data => {
        if(data.ok){
        
         setCalorie(data.data);
         
        }
        else{
               toast.error('error in getting goal calorie intake')
        }
      })
      .catch(err => {
        
        toast.error('error in getting goal calorie intake')
         
         console.log(err);
         
      })
  
  
  }
  
  React.useEffect(()=> {
    goalcalorie();
  },[calorie]);
  
  
  
  
    
       const saveSleep=async()=>{
        let tempdate=date.format('YYYY-MM-DD')
        let temptime=time.format('HH:mm:ss')
        let tempdatetime= tempdate  + " " + temptime
        let finaldatetime= new Date(tempdatetime)
  
             fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/addsleepentry', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                 
              },
              body: JSON.stringify({
               
                date:finaldatetime,
                durationInHrs:sleep.durationInHrs

                
              }),
              credentials: 'include'
          })
  
          .then(res => res.json())
          .then(data => {
            if(data.ok){
              toast.success('sleep hours added successfully');
             // getSleepHours();
            }
            else{
                   toast.error('error in adding sleep hours')
            }
          })
          .catch(err => {
            toast.error('error in adding sleep hoursss')
             console.log('error in adding sleep hours');
             
             console.log(err);
             
          })
  
             
       }
        
       const  getSleepHours=async()=>{
        
             setItems([]);
         
             fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/getsleepbydate', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                 
              },
              body: JSON.stringify({
                date:date
              }),
              credentials: 'include'
          })
  
          .then(res => res.json())
          .then(data => {
            if(data.ok){
             console.log(data.data, 'sleep data for date');
             setItems(data.data)
             
            }
            else{
                   toast.error('error in getting sleep')
            }
          })
          .catch(err => {
             toast.error('error in getting sleep');
             console.log('error in getting sleep');
             
             console.log(err);
             
          })
             
  
       }
       
       const deleteSleepHours=async(item:any)=>{
               
        fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/deletesleepentry', {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
             
          },
          body: JSON.stringify({
            date:item.date,
          }),
          credentials: 'include'
      })
  
      .then(res => res.json())
          .then(data => {
            if(data.ok){
            
              toast.success('sleep item deleted successfully');
             getSleepHours();
             
            }
            else{
                   toast.error('error in deleting sleep')
            }
          })
          .catch(err => {
             toast.error('error in deleting sleep');
             console.log('error in deleting sleep');
             
             console.log(err);
             
          })
         
       }
  
  
  
       React.useEffect(()=>{
        getSleepHours();
       },[date]);
  
        const selectedDay=(val:any) =>{
          setDate(val);
        }
  
    return (
      <div className='popupout'>
  
         <div className='popupbox'>
  
  
         <button className='close'
            onClick={() => {
              setShowSleepPopup(false);
            }}
          >
            <AiOutlineClose />
          </button>
           
          <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker 
    label="select Date"
    value={date}
    onChange={(newValue:any) => {
      selectedDay(newValue);
    }}
    />
  </LocalizationProvider>
  
          
          <TextField id="outlined-basic" label="Sleep (in hrs)" variant="outlined" color="warning" 
          type='number'
          onChange={(e) => {
            setSleep({...sleep, durationInHrs: e.target.value});
           }}
  
          />
  
           <div className='timebox'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker label="Time Picker" value={time} onChange={(newValue:any) => setTime(newValue)}
              />
            </LocalizationProvider>
           </div>
            
  
           <Button variant="contained" color="warning"
           onClick={saveSleep}
           >
            Save
          </Button> 
  
    <div className='hrline'></div>
    <div className='items'>
      {
        items.map((item:any) => {
          return (
            <div className='item'>
              <h3>{item.date.substring(0, 10)}</h3>
              <h3>{item.durationInHrs} hrs</h3>
              
              <button
              onClick={()=>{
                deleteSleepHours(item);
              }}
              ><AiFillDelete/></button>
            </div>
          )
        })
      }
    </div>
    <h5 className='maxcal'> You need to consume <b>{calorie.toFixed()}</b> cal per day according to your age, weight and gender.</h5>
  
          </div>
  
      </div>
    )
  }

export default sleepPopup
