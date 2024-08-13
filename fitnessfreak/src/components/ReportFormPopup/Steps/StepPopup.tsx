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

interface StepProps {
    setShowStepPopup: React.Dispatch<React.SetStateAction<boolean>>;
  }

  const stepPopup: React.FC<StepProps> = ({ setShowStepPopup }) => {
    const color = '#ffc20e'
  
  
    const [date, setDate] = React.useState<any>(dayjs(new Date()))
    const [time, setTime] = React.useState<any>(dayjs(new Date()))
    const [calorie, setCalorie] = React.useState<any>(0);
  
     const [step, setStep]=React.useState<any>({
        date:'',
        steps:''
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
  
  
  
  
    
       const saveStep=async()=>{
        let tempdate=date.format('YYYY-MM-DD')
        let temptime=time.format('HH:mm:ss')
        let tempdatetime= tempdate  + " " + temptime
        let finaldatetime= new Date(tempdatetime)
  
             fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/addstepentry', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                 
              },
              body: JSON.stringify({
               
                date:finaldatetime,
                steps:step.steps

                
              }),
              credentials: 'include'
          })
  
          .then(res => res.json())
          .then(data => {
            if(data.ok){
              toast.success('step added successfully');
              getSteps();
            }
            else{
                   toast.error('error in adding step')
            }
          })
          .catch(err => {
            toast.error('error in adding stepsss')
             console.log('error in adding sleep hours');
             
             console.log(err);
             
          })
  
             
       }
        
       const  getSteps=async()=>{
        
             setItems([]);
         
             fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/getstepsbydate', {
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
             console.log(data.data, 'steps data for date');
             setItems(data.data)
             
            }
            else{
                   toast.error('error in getting steps')
            }
          })
          .catch(err => {
             toast.error('error in getting steps');
             console.log('error in getting steps');
             
             console.log(err);
             
          })
             
  
       }
       
       const deleteSteps=async(item:any)=>{
               
        fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/deletestepentry', {
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
            
              toast.success('steps deleted successfully');
             getSteps();
             
            }
            else{
                   toast.error('error in deleting steps')
            }
          })
          .catch(err => {
             toast.error('error in deleting steps');
             console.log('error in deleting steps');
             
             console.log(err);
             
          })
         
       }
  
  
  
       React.useEffect(()=>{
        getSteps();
       },[date]);
  
        const selectedDay=(val:any) =>{
          setDate(val);
        }
  
    return (
      <div className='popupout'>
  
         <div className='popupbox'>
  
  
         <button className='close'
            onClick={() => {
              setShowStepPopup(false);
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
  
          
          <TextField id="outlined-basic" label="Steps (in number)" variant="outlined" color="warning" 
          type='number'
          onChange={(e) => {
            setStep({...step, steps: e.target.value});
           }}
  
          />
  
           <div className='timebox'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker label="Time Picker" value={time} onChange={(newValue:any) => setTime(newValue)}
              />
            </LocalizationProvider>
           </div>
            
  
           <Button variant="contained" color="warning"
           onClick={saveStep}
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
              <h3>{item.steps} steps </h3>
              
              <button
              onClick={()=>{
                deleteSteps(item);
              }}
              ><AiFillDelete/> </button>
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

export default stepPopup


