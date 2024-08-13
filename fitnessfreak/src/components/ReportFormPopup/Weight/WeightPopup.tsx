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

interface WeightProps {
    setShowWeightPopup: React.Dispatch<React.SetStateAction<boolean>>;
  }

  const stepPopup: React.FC<WeightProps> = ({ setShowWeightPopup }) => {
    const color = '#ffc20e'
  
  
    const [date, setDate] = React.useState<any>(dayjs(new Date()))
    const [time, setTime] = React.useState<any>(dayjs(new Date()))
    const [calorie, setCalorie] = React.useState<any>(0);
  
     const [weight, setWeight]=React.useState<any>({
        date:'',
        weightInKg:''
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
  
  
  
  
    
       const saveWeight=async()=>{
        let tempdate=date.format('YYYY-MM-DD')
        let temptime=time.format('HH:mm:ss')
        let tempdatetime= tempdate  + " " + temptime
        let finaldatetime= new Date(tempdatetime)
  
             fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/weighttrack/addweightentry', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                 
              },
              body: JSON.stringify({
               
                date:finaldatetime,
                weightInKg:weight. weightInKg

             }),
              credentials: 'include'
          })
  
          .then(res => res.json())
          .then(data => {
            if(data.ok){
              toast.success('weight added successfully');
              getWeight();
            }
            else{
                   toast.error('error in adding weight')
            }
          })
          .catch(err => {
            toast.error('error in adding weighttt')
             console.log('error in adding weight');
             
             console.log(err);
             
          })
  
             
       }
        
       const  getWeight=async()=>{
        
             setItems([]);
         
             fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/weighttrack/getweightbydate', {
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
             console.log(data.data, 'weight data for date');
             setItems(data.data);
             
            }
            else{
                   toast.error('error in getting weight')
            }
          })
          .catch(err => {
             toast.error('error in getting weight');
             console.log('error in getting weight');
             
             console.log(err);
             
          })
             
  
       }
       
       const deleteWeight=async(item:any)=>{
               
        fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/weighttrack/deleteweightentry', {
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
            
              toast.success('weight deleted successfully');
             getWeight();
             
            }
            else{
                   toast.error('error in deleting weight')
            }
          })
          .catch(err => {
             toast.error('error in deleting weight');
             console.log('error in deleting weightt');
             
             console.log(err);
             
          })
         
       }
  
  
  
       React.useEffect(()=>{
        getWeight();
       },[date]);
  
        const selectedDay=(val:any) =>{
          setDate(val);
        }
  
    return (
      <div className='popupout'>
  
         <div className='popupbox'>
  
  
         <button className='close'
            onClick={() => {
              setShowWeightPopup(false);
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
  
          
          <TextField id="outlined-basic" label="weight (in kg)" variant="outlined" color="warning" 
          type='number'
          onChange={(e) => {
            setWeight({...weight, weightInKg: e.target.value});
           }}
  
          />
  
           <div className='timebox'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker label="Time Picker" value={time} onChange={(newValue:any) => setTime(newValue)}
              />
            </LocalizationProvider>
           </div>
            
  
           <Button variant="contained" color="warning"
           onClick={saveWeight}
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
              <h3>{item.weight} kgs</h3>
              
              <button
              onClick={()=>{
                deleteWeight(item);
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

export default stepPopup


