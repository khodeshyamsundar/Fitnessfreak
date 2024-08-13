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
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

interface CaloriIntakePopupProps {
  setShowCalorieIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalorieIntakePopup: React.FC<CaloriIntakePopupProps> = ({ setShowCalorieIntakePopup }) => {
  const color = '#ffc20e'


  const [date, setDate] = React.useState<any>(dayjs(new Date()))
  const [time, setTime] = React.useState<any>(dayjs(new Date()))
  const [calorie, setCalorie] = React.useState<any>(0)

   const [calorieIntake, setCalorieIntake]=React.useState<any>({
      item:'',
      date:'',
      quantity:'',
      quantitytype:'g'
   })

   const [items, setItems]=React.useState<any>([]);
  
    
      const saveCalorieIntake=async()=>{
           let tempdate=date.format('YYYY-MM-DD')
           let temptime=time.format('HH:mm:ss')
           let tempdatetime= tempdate  + " " + temptime
           let finaldatetime= new Date(tempdatetime)
           console.log('finaldate' + finaldatetime);

           fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/addcalorieintake', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
               
            },
            body: JSON.stringify({
              item:calorieIntake.item,
              date:finaldatetime,
              quantity:calorieIntake.quantity,
              quantitytype:calorieIntake.quantitytype
            }),
            credentials: 'include'
        })

        .then(res => res.json())
        .then(data => {
          if(data.ok){
            toast.success('calorie intake added successfully');
            getCalorieIntake();
          }
          else{
                 toast.error('error in adding calori eintake')
          }
        })
        .catch(err => {
           toast.error('error in adding calorieintake');
           console.log('error in adding calorieintake');
           
           console.log(err);
           
        })

           
     }
      
     const getCalorieIntake=async()=>{
      
           setItems([])
       
           fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/getcalorieintakebydate', {
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
           console.log(data.data, 'calorie intake data for date');
           setItems(data.data)
           
          }
          else{
                 toast.error('error occured')
          }
        })
        .catch(err => {
           toast.error('error occured');
           console.log('error in getting calorieintake');
           
           console.log(err);
           
        })
           

     }
     
     const deleteCalorieIntake=async(item:any)=>{
             
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/deletecalorieintake', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
           
        },
        body: JSON.stringify({
          item:item.item,
          date:item.date
        }),
        credentials: 'include'
    })

    .then(res => res.json())
        .then(data => {
          if(data.ok){
          
            toast.success('calorie intake item deleted successfully');
            getCalorieIntake();
           
          }
          else{
                 toast.error('error in deleting calorie intake')
          }
        })
        .catch(err => {
           toast.error('error in deleting calorieintake');
           console.log('error in deleting calorieintake');
           
           console.log(err);
           
        })
       
     }



     React.useEffect(()=>{
      getCalorieIntake();
     },[date]);

      const selectedDay=(val:any) =>{
        setDate(val);
      }

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
     

  return (
    <div className='popupout'>

       <div className='popupbox'>


       <button className='close'
          onClick={() => {
            setShowCalorieIntakePopup(false)
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
        
                              <Select
                                    color="warning"
                                    placeholder="food item name"
                                    size="lg"
                                    variant="outlined"
                                     onChange={(
                                      event: React.SyntheticEvent | null,
                                      newValue: string | null,
                                  ) => {
                                    setCalorieIntake({...calorieIntake, item: newValue?.toString() || ''})
                                  }}
                                >
                                    <Option value="paneer">paneer</Option>
                                    <Option value="chapati">chapati</Option>
                                    <Option value="rice">rice</Option>
                                    <Option value="chicken">chicken</Option>
                                    <Option value="egg">egg</Option>
                                    <Option value="soyachunk">soyachunk</Option>
                                    <Option value="oats">oats</Option>
                                    <Option value="spinach">spinach</Option>
                                    <Option value="potato">potato</Option>
                                    <Option value="milk">milk</Option>
                                    <Option value="honey">honey</Option>
                                    <Option value="peanutbutter">peanutbutter</Option>
                                </Select>
        {/* <TextField id="outlined-basic" label="Food item name" variant="outlined" color="warning"
         onChange={(e) => {
          setCalorieIntake({...calorieIntake, item: e.target.value})
         }}
        />   */}
        <TextField id="outlined-basic" label="Food item amount (in gms)" variant="outlined" color="warning" 
        type='number'
        onChange={(e) => {
          setCalorieIntake({...calorieIntake, quantity: e.target.value})
         }}

        />

         <div className='timebox'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker label="Time Picker" value={time} onChange={(newValue:any) => setTime(newValue)}
            />
          </LocalizationProvider>
         </div>
          

         <Button variant="contained" color="warning"
         onClick={saveCalorieIntake}
         >
          Save
        </Button> 

  <div className='hrline'></div>
  <div className='items'>
    {
      items.map((item:any) => {
        return (
          <div className='item'>
            <h3>{item.item}</h3>
            <h3>{item.quantity} {item.quantitytype}</h3>
            <h3>{item.calorieIntake}cal</h3>
            <button
            onClick={()=>{
              deleteCalorieIntake(item);
            }}
            ><AiFillDelete/></button>
          </div>
        )
      })
    }
  </div>
  <h5 className='maxcal'> You need to consume <b>{calorie.toFixed()}</b> cal per day according to your age, weight and gender.</h5>

        </div>


      {/* <div className='popupbox'>
        <button className='close'
          onClick={() => {
            setShowCalorieIntakePopup(false)
          }}
        >
          <AiOutlineClose />
        </button>

        <DatePicker getSelectedDay={selectedDay}
          endDate={100}
          selectDate={new Date()}
          labelFormat={"MMMM"}
          color={color}
        />

        <TextField id="outlined-basic" label="Food item name" variant="outlined" color="warning" />
        <TextField id="outlined-basic" label="Food item amount (in gms)" variant="outlined" color="warning" />

        <div className='timebox'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeClock value={value} onChange={(newValue) => setValue(newValue)}
            />
          </LocalizationProvider>

        </div>
        <Button variant="contained" color="warning">
          Save
        </Button>
        <div className='hrline'></div>
        <div className='items'>
          <div className='item'>
            <h3>Apple</h3>
            <h3>100 gms</h3>
            <button> <AiFillDelete /></button>
          </div>
          <div className='item'>
            <h3>Banana</h3>
            <h3>200 gms</h3>
            <button> <AiFillDelete /></button>

          </div>
          <div className='item'>
            <h3>Rice</h3>
            <h3>300 gms</h3>
            <button> <AiFillDelete /></button>

          </div>
        </div>
      </div> */}
    </div>
  )
}

export default CalorieIntakePopup