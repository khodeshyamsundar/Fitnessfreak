import React from 'react'
import '../popup.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from 'react-toastify';

interface WorkoutPopupProps {
  setShowWorkoutPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalorieIntakePopup: React.FC<WorkoutPopupProps> = ({ setShowWorkoutPopup }) => {
  const color = '#ffc20e'


  const [date, setDate] = React.useState<any>(dayjs(new Date()))
  const [time, setTime] = React.useState<any>(dayjs(new Date()))
  const [calorie, setCalorie] = React.useState<any>(0)

   const [workout, setWorkout]=React.useState<any>({
     
      date:'',
      exercise:'',
       durationInMinutes:''
    
   })

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




  
     const saveWorkout=async()=>{
           let tempdate=date.format('YYYY-MM-DD')
           let temptime=time.format('HH:mm:ss')
           let tempdatetime= tempdate  + " " + temptime
           let finaldatetime= new Date(tempdatetime)
           console.log('finaldate' + finaldatetime);

           fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/workouttrack/addworkoutentry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
               
            },
            body: JSON.stringify({
              date:finaldatetime,
              exercise:workout.exercise,
       durationInMinutes:workout. durationInMinutes
             
            }),
            credentials: 'include'
        })

        .then(res => res.json())
        .then(data => {
          if(data.ok){
            toast.success('workout added successfully');
            getWorkout();
          }
          else{
                 toast.error('error in adding workout')
          }
        })
        .catch(err => {
           toast.error('error in adding workout');
           console.log('error in adding workout');
           
           console.log(err);
           
        })

           
     }
      
     const getWorkout=async()=>{
      
           setItems([])
       
           fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/workouttrack/getworkoutbydate', {
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
           console.log(data.data, 'workout data for date');
           setItems(data.data);
           
          }
          else{
                 toast.error('error in getting workout')
          }
        })
        .catch(err => {
           toast.error('error in getting workout');
           console.log('error in gettingworkout');
           
           console.log(err);
           
        })
           

     }
     
     const deleteWorkout=async(item:any)=>{
             
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/workouttrack/deleteworkoutentry', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
           
        },
        body: JSON.stringify({
         
          date:item.date
        }),
        credentials: 'include'
    })

    .then(res => res.json())
        .then(data => {
          if(data.ok){
          
            toast.success('workout item deleted successfully');
            getWorkout();
           
          }
          else{
                 toast.error('error in deleting workout')
          }
        })
        .catch(err => {
           toast.error('error in deleting workout');
           console.log('error in deleting workout');
           
           console.log(err);
           
        })
       
     }



     React.useEffect(()=>{
      getWorkout();
     },[date]);

      const selectedDay=(val:any) =>{
        setDate(val);
      }

  return (
    <div className='popupout'>

       <div className='popupbox'>


       <button className='close'
          onClick={() => {
            setShowWorkoutPopup(false)
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

       
        <TextField id="outlined-basic" label="workout " variant="outlined" color="warning" 
        type='text'
        onChange={(e) => {
          setWorkout({...workout, exercise: e.target.value})
         }}
        />
        <TextField id="outlined-basic" label="minutes" variant="outlined" color="warning" 
        type='number'
        onChange={(e) => {
          setWorkout({...workout, durationInMinutes: e.target.value})
         }}
        />

         <div className='timebox'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker label="Time Picker" value={time} onChange={(newValue:any) => setTime(newValue)}
            />
          </LocalizationProvider>
         </div>
          

         <Button variant="contained" color="warning"
         onClick={saveWorkout}
         >
          Save
        </Button> 

  <div className='hrline'></div>
  <div className='items'>
    {
      items.map((item:any) => {
        return (
          <div className='item'>
            <h3>{item.exercise}</h3>
            <h3>{item.durationInMinutes} min</h3>
            
            <button
            onClick={()=>{
              deleteWorkout(item);
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

export default CalorieIntakePopup