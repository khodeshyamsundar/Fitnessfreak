"use client"
import React from 'react'
import { LineChart } from '@mui/x-charts/LineChart';
import './ReportPage.css'
import { ScatterSeriesType } from '@mui/x-charts'
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import { AiFillEdit } from 'react-icons/ai'
import CaloriIntakePopup from '@/components/ReportFormPopup/CalorieIntake/CalorieIntakePopup';
import SleepPopup from '@/components/ReportFormPopup/Sleep/SleepPopup';
import StepPopup from '@/components/ReportFormPopup/Steps/StepPopup';
import WorkoutPopup from '@/components/ReportFormPopup/Workout/WorkoutPopup';
import WaterIntakePopup from '@/components/ReportFormPopup/Water/WaterIntakePopup';
import WeightPopup from '@/components/ReportFormPopup/Weight/WeightPopup';
import { usePathname } from 'next/navigation';
import { log } from 'console';
import { toast } from 'react-toastify';
// import {
//     Legend,
//     Line,
//     LineChart,
//     ResponsiveContainer,
//     Tooltip,
//     XAxis,
//     YAxis,
//   } from "recharts";

const page = () => {
    const color = '#ffc20e'
    const pathname = usePathname();
    console.log(pathname);

    const chartsParams = {
        // margin: { bottom: 20, left: 25, right: 5 },
        height: 300,

    };
    
    const [items, setItems]=React.useState<any>([]);
    const [dataS1, setDataS1] = React.useState<any>(null)
    const [workout, setWorkout] = React.useState<boolean>()

    


    const getDataForS1 = async () => {

        if (pathname == '/report/Calorie%20Intake') {
            fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/getcalorieintakebylimit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({ limit: 10 }),
                credentials: 'include'
            })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {


                        let temp = data.data.map((item: any) => {
                            return ({
                                date: item.date,
                                value: item.calorieIntake,
                                unit: 'kcal'
                            })
                        })
                       // setDataS1(temp);
                        console.log(temp);

                        let dataForLineChart = temp.map((item: any) => item.value);

                        let dataForXAxis = temp.map((item: any) => new Date(item.date));
                        // console.log(dataForLineChart);
                        // console.log(dataForXAxis);


                        setDataS1({
                            data: dataForLineChart,
                            title: 'Calorie Intake',
                            color: color,
                            xAxis: {
                                data: dataForXAxis,
                                label: 'Last few Days',
                                scaleType: 'time'
                            }
                        })


                    }
                    else {
                        setDataS1([])
                    }
                })

                .catch(err => {
                    console.log(err);

                })




        }
        else if (pathname == '/report/Sleep') {
            fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/getsleepbylimit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({ limit: 10 }),
                credentials: 'include'
            })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {


                        let temp = data.data.map((item: any) => {
                            return {
                                date: item.date, 
                                value: item.durationInHrs,
                                unit: 'hrs'
                            }
                        })
                        // console.log(temp);

                        let dataForLineChart = temp.map((item: any) => item.value);

                        let dataForXAxis = temp.map((item: any) => new Date(item.date));
                        // console.log(dataForLineChart);
                        // console.log(dataForXAxis);


                        setDataS1({
                            data: dataForLineChart,
                            title: 'Sleep hours',
                            color: color,
                            xAxis: {
                                data: dataForXAxis,
                                label: 'Last few Days',
                                scaleType: 'time'
                            }
                        })


                    }
                    else {
                        setDataS1([])
                    }
                })

                .catch(err => {
                    console.log(err);

                })




        }
    
    else if (pathname == '/report/Steps'){
        fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/getstepsbylimit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({ limit: 10 }),
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {


                    let temp = data.data.map((item: any) => {
                        return ({
                            date: item.date,
                            value: item.steps,
                            unit: 'kcal'
                        })
                    })
                   // setDataS1(temp);
                    console.log(temp);

                    let dataForLineChart = temp.map((item: any) => item.value);

                    let dataForXAxis = temp.map((item: any) => new Date(item.date));
                    // console.log(dataForLineChart);
                    // console.log(dataForXAxis);


                    setDataS1({
                        data: dataForLineChart,
                        title: 'steps',
                        color: color,
                        xAxis: {
                            data: dataForXAxis,
                            label: 'Last few Days',
                            scaleType: 'time'
                        }
                    })


                }
                else {
                    setDataS1([])
                }
            })

            .catch(err => {
                console.log(err);

            })




    }
    else if (pathname == '/report/Water') {
        fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/getwaterbylimit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({ limit: 10 }),
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {


                    let temp = data.data.map((item: any) => {
                        return ({
                            date: item.date,
                            value: item.amountInMilliliters,
                            unit: 'kcal'
                        })
                    })
                   // setDataS1(temp);
                    console.log(temp);

                    let dataForLineChart = temp.map((item: any) => item.value);

                    let dataForXAxis = temp.map((item: any) => new Date(item.date));
                    // console.log(dataForLineChart);
                    // console.log(dataForXAxis);


                    setDataS1({
                        data: dataForLineChart,
                        title: 'Water Intake in ml',
                        color: color,
                        xAxis: {
                            data: dataForXAxis,
                            label: 'Last few Days',
                            scaleType: 'time'
                        }
                    })


                }
                else {
                    setDataS1([])
                }
            })

            .catch(err => {
                console.log(err);

            })




    }

    
    else if (pathname == '/report/Workout'){
          
        setItems([])
       
           fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/workouttrack/getworkout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
               
            },
           
            credentials: 'include'
        })

        .then(res => res.json())
        .then(data => {
          if(data.ok){
           console.log(data.data, 'workout data ');
           setItems(data.data);
           setWorkout(true);
           
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
     else if (pathname == '/report/Weight') {
        fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/weighttrack/getweightbylimit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({ limit: 10 }),
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {


                    let temp = data.data.map((item: any) => {
                        return {
                            date: item.date,
                            value: item.weight,
                            unit: 'kg'
                        }
                    })
                    console.log('weight');
                    
                     console.log(temp);

                    let dataForLineChart = temp.map((item: any) => item.value);

                    let dataForXAxis = temp.map((item: any) => new Date(item.date));
                    // console.log(dataForLineChart);
                    // console.log(dataForXAxis);


                    setDataS1({
                        data: dataForLineChart,
                        title: 'weight in kgs',
                        color: color,
                        xAxis: {
                            data: dataForXAxis,
                            label: 'Last 10 Days',
                            scaleType: 'time'
                        }
                    })


                }
                else {
                    setDataS1([])
                }
            })

            .catch(err => {
                console.log(err);

            })




    }
        //     // let temp = [
        //     //     {
        //     //         date: 'Thu Sep 28 2023 20:30:30 GMT+0530 (India Standard Time)',
        //     //         value: 2000,
        //     //         unit: 'kcal'
        //     //     },
        //     //     {
        //     //         date: 'Wed Sep 27 2023 20:30:30 GMT+0530 (India Standard Time)',
        //     //         value: 2500,
        //     //         unit: 'kcal'
        //     //     },
        //     //     {
        //     //         date: 'Tue Sep 26 2023 20:30:30 GMT+0530 (India Standard Time)',
        //     //         value: 2700,
        //     //         unit: 'kcal'
        //     //     },
        //     //     {
        //     //         date: 'Mon Sep 25 2023 20:30:30 GMT+0530 (India Standard Time)',
        //     //         value: 3000,
        //     //         unit: 'kcal'
        //     //     },
        //     //     {
        //     //         date: 'Sun Sep 24 2023 20:30:30 GMT+0530 (India Standard Time)',
        //     //         value: 2000,
        //     //         unit: 'kcal'
        //     //     },
        //     //     {
        //     //         date: 'Sat Sep 23 2023 20:30:30 GMT+0530 (India Standard Time)',
        //     //         value: 2300,
        //     //         unit: 'kcal'
        //     //     },
        //     //     {
        //     //         date: 'Fri Sep 22 2023 20:30:30 GMT+0530 (India Standard Time)',
        //     //         value: 2500,
        //     //         unit: 'kcal'
        //     //     },
        //     //     {
        //     //         date: 'Thu Sep 21 2023 20:30:30 GMT+0530 (India Standard Time)',
        //     //         value: 2700,
        //     //         unit: 'kcal'
        //     //     },
        //     // ]

        //     // let dataForLineChart = temp.map((item: any) => {
        //     //     let val = JSON.stringify(item.value)
        //     //     return val
        //     // })

        //     // let dataForXAxis = temp.map((item: any) => {
        //     //     let val = new Date(item.date)
        //     //     return val
        //     // })

        //     // console.log({
        //     //     data: dataForLineChart,
        //     //     title: '1 Day Calorie Intake',
        //     //     color: color,
        //     //     xAxis: {
        //     //         data: dataForXAxis,
        //     //         label: 'Last 10 Days',
        //     //         scaleType: 'time'
        //     //     }
        //     // })

        //     // setDataS1({
        //     //     data: dataForLineChart,
        //     //     title: '1 Day Calorie Intake',
        //     //     color: color,
        //     //     xAxis: {
        //     //         data: dataForXAxis,
        //     //         label: 'Last 10 Days',
        //     //         scaleType: 'time'
        //     //     }
        //     // })

    }
    console.log("data:");
    console.log(dataS1?.xAxis?.data);
    React.useEffect(() => {
        getDataForS1();
    }, []);



    const [showCalorieIntakePopup, setShowCalorieIntakePopup] = React.useState<boolean>(false)
    const [showSleepPopup, setShowSleepPopup] = React.useState<boolean>(false)
    const [showStepPopup, setShowStepPopup] = React.useState<boolean>(false)
    const [showWaterIntakePopup, setShowWaterIntakePopup] = React.useState<boolean>(false)
    const [showWorkoutPopup, setShowWorkoutPopup] = React.useState<boolean>(false)
    const [showWeightPopup, setShowWeightPopup] = React.useState<boolean>(false)
    return (
        <div className='reportpage'>


           

           {
             workout ?
             <>
                   <div className='components'>
    {
      items.map((item:any) => {
        return (
          <div className='component'>
            
            <h3>{item.exercise}    </h3>
            <h3> {item.date.substring(0, 10)}</h3>
            <h3>{item.durationInMinutes}min</h3>

            
          
          </div>
        )
      })
    }
  </div>      
             </>
             :
             <>
              {
                dataS1 !== null ?
                    <div className='s1'>
                        {
                            <LineChart
                                xAxis={[{
                                    // id: 'Day',
                                    data: dataS1?.xAxis?.data,
                                    scaleType: dataS1?.xAxis?.scaleType,
                                    label: dataS1?.xAxis?.label,
                                    valueFormatter: (date: Date | string) => {
                                        // Check if the date is a valid Date object or a string that can be converted to a Date
                                        if (typeof date === 'string' || date instanceof String) {
                                            date = new Date(date);
                                        }
                                    
                                        // Check if the date is now a valid Date object
                                        if (date instanceof Date && !isNaN(date.getTime())) {
                                            return date.toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                            });
                                        } else {
                                            // Fallback if date is not valid
                                            return '';
                                        }
                                    }
                                    
                                }]}

                                series={[
                                    {
                                        data: dataS1?.data,
                                        label: dataS1?.title,
                                        color: dataS1?.color,
                                    },
                                ]}
                                {...chartsParams}
                            />
                        }
                    </div> : <h1>Loading...!</h1>
            }
             </>
           }






            <button className='editbutton'
                onClick={() => {

                    if (pathname == '/report/Calorie%20Intake') {
                        setShowCalorieIntakePopup(true);
                        console.log('hiii');

                    }
                    else if (pathname == '/report/Sleep') {
                        setShowSleepPopup(true);
                    }
                    else if (pathname == '/report/Steps') {
                        setShowStepPopup(true);
                    }
                    else if (pathname == '/report/Water') {
                        setShowWaterIntakePopup(true);
                    }
                    else if (pathname == '/report/Workout') {
                        setShowWorkoutPopup(true);
                    }
                    else if (pathname == '/report/Weight') {
                        setShowWeightPopup(true);
                    }
                    else {
                        toast('show another report')
                    }


                }}
            >
                <AiFillEdit />
            </button>

            {
                showCalorieIntakePopup &&
                <CaloriIntakePopup setShowCalorieIntakePopup={setShowCalorieIntakePopup} />
            }
            {
                showSleepPopup &&
                <SleepPopup setShowSleepPopup={setShowSleepPopup} />
            }
            {
                showStepPopup &&
                <StepPopup setShowStepPopup={setShowStepPopup} />
            }
            {
                showWaterIntakePopup &&
                <WaterIntakePopup setShowWaterIntakePopup={setShowWaterIntakePopup} />
            }
            {
                showWorkoutPopup &&
                <WorkoutPopup setShowWorkoutPopup={setShowWorkoutPopup} />
            }
            {
                showWeightPopup &&
                <WeightPopup setShowWeightPopup={setShowWeightPopup} />
            }
        </div>
    )


}

export default page



