import apiService from '../../services/api.service'
import { useState, useContext } from 'react'
import '../IndexPage/indexPage.css'
import countries from '../../countries.json'
import Select from 'react-select'
import providers from '../../providers.json'
import { ThemeContext } from '../../context/theme.context'
import Spinner from '../../components/Spinner/Spinner'

const IndexPage = () => {

    const [input, setInput] = useState({
        sourceCurrency: "",
        targetCurrency: "",
        sendAmount: ''
    })
    const [source, setSource] = useState()
    const [loading, setLoading] = useState(false)
    const { sourceCurrency, targetCurrency, sendAmount } = input
    const { theme } = useContext(ThemeContext)

    const handleInput = e => {
        const { name, value } = e.target
        setInput({ ...input, [name]: value })
    }

    const handleSubmit = e => {
        e.preventDefault()
        if (sourceCurrency === "" || targetCurrency === "" || sendAmount === "") {
            console.log('error', 'Please fill all the fields')
        }
        setLoading(true)
        setTimeout(() => {
            oneCall()
        }, 1000);

    }

    const sendingOptions = countries.map(country => ({
        key: country.id,
        value: country.currency.code,
        label: country.name.esp,
        flag: `data:image/png;base64,${country.flag}`,
    }))


    const oneCall = () => {

        apiService
            .getInput(sourceCurrency, targetCurrency, sendAmount)
            .then(({ data }) => {
                setSource(data.providers)
                setLoading(false)
            })
            .catch(err => console.log(err))

    }



    return (
        <div className={theme}>

            <div className='main' >
                <section className="text-gray-400 body-font">
                    <div className="container mx-auto flex md:py-24 md:flex-row flex-col items-center">

                        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left md:mb-0 items-center text-center">
                            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">Buscamos los envios internacionales más favorables por ti.</h1>
                            <p className="inline-block title-font sm:text-xl text-2xl mb-4 font-medium text-white" >Encuentra un mejor precio en pocos clicks. </p>
                            <p className="mb-8 leading-relaxed">Aquí podrás comparar entre las distintas opciones para el envío de remesas y elegir la opción que más te convenga.</p>
                        </div>

                        <div className="lg:max-w-lg lg:w-full md:w-1/2 ">
                            <div className=" mx-auto ">
                                <div className="card container w-full bg-white rounded-lg p-8 flex flex-col mt-2 mb-4 md:mb-0 md:mt-0 relative z-10 shadow-lg">
                                    <form className="w-full" onSubmit={handleSubmit}>

                                        <div className="relative mb-4">
                                            <label className="leading-7 text-sm text-gray-600">País origen</label>
                                            <Select
                                                id="sourceCurrency"
                                                options={sendingOptions}
                                                key={sendingOptions.label}
                                                onChange={e => setInput({ ...input, sourceCurrency: e.value })}
                                                placeholder="Selecciona el país origen"
                                                name='sourceCurrency'
                                                className='bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none leading-6 transition-colors duration-200 ease-in-out'
                                            />
                                        </div>

                                        <div className="relative mb-4">
                                            <label className="leading-7 text-sm text-gray-600">País destino</label>
                                            <Select
                                                id="targetCurrency"
                                                options={sendingOptions}
                                                key={sendingOptions.label}
                                                onChange={e => setInput({ ...input, targetCurrency: e.value })}
                                                placeholder="Selecciona el país destino"
                                                name='targetCurrency'
                                                className='bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none leading-6 transition-colors duration-200 ease-in-out'
                                            />
                                        </div>

                                        <div className="relative mb-4">
                                            <label className="leading-7 text-sm text-gray-600">Cantidad a enviar</label>
                                            <input
                                                id="sendAmount"
                                                type="number"
                                                name='sendAmount'
                                                value={sendAmount}
                                                onChange={handleInput}

                                                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none pl-2 leading-8 transition-colors duration-200 ease-in-out" />
                                        </div>

                                        <button type="submit" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full">
                                            Buscar la mejor opción
                                        </button>
                                        <p className="text-xs text-gray-500 mt-3">Lo hacemos por ti.</p>
                                    </form>
                                </div>

                            </div>
                        </div>

                    </div >

                </section >

                <section className={"text-gray-400 body-font" + theme}>
                    <div className="w-full">
                        {
                            loading ?
                                <Spinner />

                                :

                                source == 0 ?
                                    <div className="flex flex-col text-center w-full mb-10">
                                        <div className="flex flex-col text-center w-full mb-10">
                                            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">No hay opciones disponibles</h1>
                                            <p className="mb-8 leading-relaxed" >Por favor, elige otro país.</p>
                                        </div>
                                    </div>

                                    :

                                    source?.map(provider => {


                                        const { logos, quotes, name } = provider
                                        const handleClick = () => {
                                            if (providers.find(provider => provider.name === name)) {
                                                const url = providers.find(provider => provider.name === name).url
                                                window.open(url, '_blank')

                                            }
                                        }
                                        return (
                                            <>

                                                <section className=" body-font relative">

                                                    <div className=" container py-5 lg:py-10 mx-auto flex ">

                                                        <div className="card bg-white rounded-lg p-8 flex flex-col md:flex-row w-full lg:w-10/12 lg:m-auto">

                                                            <div className="flex mt-3 place-content-between align-middle md:flex-col md:mx-12 lg:mx-7" >
                                                                <div >
                                                                    <img className="w-24 max-h-14 object-cover lg:w-60" viewBox="0 0 24 24" alt='bank logo'
                                                                        src={theme === "dark" ? logos.normal.svgUrl : logos.white.svgUrl} />
                                                                </div>
                                                                <div className='px-4 py-2 my-1 text-xs md:my-3 lg:mx-7 leading-none text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"'>
                                                                    <p >Comisión: </p>
                                                                    <p >{quotes[0].fee} {sourceCurrency}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col w-full text-sm text-black md:items-center md:text-base lg:flex-row lg:justify-evenly lg:text-xl">
                                                                <div className=' flex flex-row lg:flex-col'>
                                                                    <p className="mt-3">Tú envías:&nbsp; </p>
                                                                    <p className="mt-3 lg:mt-0"> {sendAmount} {sourceCurrency}</p>
                                                                </div>
                                                                <div className=' flex flex-row lg:flex-col'>
                                                                    <p className="mt-3">Allí reciben:&nbsp; </p>
                                                                    <p className="mt-3 lg:mt-0"> {quotes[0]?.receivedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} {targetCurrency} </p>
                                                                </div>
                                                            </div>

                                                            <div className='mt-6 md:mx-12 md:mt-3 lg:mx-7'>
                                                                <button type="button" onClick={handleClick} className="rounded-lg text-sm lg:text-lg px-5 py-2.5 text-center flex text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 ">
                                                                    Enviar dinero
                                                                    <svg className="w-5 h-5 lg:w-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </section>
                                            </>
                                        )
                                    })

                        }



                    </div>
                </section >

            </div >
        </div>


    )

}
export default IndexPage