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

interface WaterIntakePopupProps {
  setShowWaterIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalorieIntakePopup: React.FC<WaterIntakePopupProps> = ({ setShowWaterIntakePopup }) => {
  const color = '#ffc20e'


  const [date, setDate] = React.useState<any>(dayjs(new Date()))
  const [time, setTime] = React.useState<any>(dayjs(new Date()))
  const [calorie, setCalorie] = React.useState<any>(0)

   const [waterIntake, setWaterIntake]=React.useState<any>({
     
      date:'',
      amountInMilliliters:''
    
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




  
     const saveWaterIntake=async()=>{
           let tempdate=date.format('YYYY-MM-DD')
           let temptime=time.format('HH:mm:ss')
           let tempdatetime= tempdate  + " " + temptime
           let finaldatetime= new Date(tempdatetime)
           console.log('finaldate' + finaldatetime);

           fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/addwaterentry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
               
            },
            body: JSON.stringify({
              date:finaldatetime,
              amountInMilliliters:waterIntake.amountInMilliliters
             
            }),
            credentials: 'include'
        })

        .then(res => res.json())
        .then(data => {
          if(data.ok){
            toast.success('water intake added successfully');
            getWaterIntake();
          }
          else{
                 toast.error('error in adding water eintake')
          }
        })
        .catch(err => {
           toast.error('error in adding water intake');
           console.log('error in adding water intake');
           
           console.log(err);
           
        })

           
     }
      
     const getWaterIntake=async()=>{
      
           setItems([])
       
           fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/getwaterbydate', {
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
           console.log(data.data, 'water intake data for date');
           setItems(data.data);
           
          }
          else{
                 toast.error('error in getting water intake')
          }
        })
        .catch(err => {
           toast.error('error in getting waterintake');
           console.log('error in getting waterintake');
           
           console.log(err);
           
        })
           

     }
     
     const deleteWaterIntake=async(item:any)=>{
             
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/deletewaterentry', {
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
          
            toast.success('water intake item deleted successfully');
            getWaterIntake();
           
          }
          else{
                 toast.error('error in deleting water intake')
          }
        })
        .catch(err => {
           toast.error('error in deleting waterintake');
           console.log('error in deleting waterintake');
           
           console.log(err);
           
        })
       
     }



     React.useEffect(()=>{
      getWaterIntake();
     },[date]);

      const selectedDay=(val:any) =>{
        setDate(val);
      }

  return (
    <div className='popupout'>

       <div className='popupbox'>


       <button className='close'
          onClick={() => {
            setShowWaterIntakePopup(false)
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

       
        <TextField id="outlined-basic" label="water (in ml)" variant="outlined" color="warning" 
        type='number'
        onChange={(e) => {
          setWaterIntake({...waterIntake, amountInMilliliters: e.target.value})
         }}

        />

         <div className='timebox'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker label="Time Picker" value={time} onChange={(newValue:any) => setTime(newValue)}
            />
          </LocalizationProvider>
         </div>
          

         <Button variant="contained" color="warning"
         onClick={saveWaterIntake}
         >
          Save
        </Button> 

  <div className='hrline'></div>
  <div className='items'>
    {
      items.map((item:any) => {
        return (
          <div className='item'>
            <h3>{item.date.substring(0,10)}</h3>
            <h3>{item.amountInMilliliters} ml</h3>
            
            <button
            onClick={()=>{
              deleteWaterIntake(item);
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