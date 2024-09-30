/* eslint-disable react/no-unescaped-entities */
"use client"

import { SignedOut, SignInButton } from "@clerk/clerk-react"
import { useEffect, useRef, useState } from "react"
import { theme } from "../style"

import { ReactTyped } from "react-typed"
import { getRandomTopicsData, getSubscribedTopics, getTopicData } from "~/server/topicsData"
import { LuBookmark, LuCornerDownLeft, LuCornerLeftDown, LuCornerRightDown, LuMessageCircle, LuSparkles, LuVideo } from "react-icons/lu"
import Link from "next/link"

import { Stage, Layer, Line } from 'react-konva';
import { getTrackBackground, Range } from "react-range"

export default function Body() {
    const firstItem = useRef(null)

    const [exploreHover, setExploreHover] = useState(false)

    const randomTopicDatas = [
        {
          "title": "Rise of Nationalism and Self-Determination Movements",
          "subject": "History",
          "content": "Rise of Nationalism and Self-Determination Movements"
        },
        {
          "title": "Structure and properties",
          "subject": "Chemistry",
          "content": "Organic Reactions: Alkene Reactions - Structure and Properties"
        },
        {
          "title": "Volcanoes",
          "subject": "Geography",
          "content": "Volcanoes: Nature's Fury"
        },
        {
          "title": "Communicable Disease",
          "subject": "Biology",
          "content": "Communicable Diseases"
        },
        {
          "title": "Reactions: oxidation, dehydration",
          "subject": "Chemistry",
          "content": "Organic Reactions: Alcohol Reactions - Oxidation and Dehydration"
        },
        {
          "title": "Fusion",
          "subject": "Physics",
          "content": "Radiation - Fusion"
        },
        {
          "title": "Acids",
          "subject": "Chemistry",
          "content": "Understanding Acids: Categorization and Characteristics"
        },
        {
          "title": "Memory and Adaptive Immunity",
          "subject": "Biology",
          "content": "Memory and Adaptive Immunity"
        },
        {
          "title": "Diagonal Matrix",
          "subject": "Further Maths",
          "content": "Diagonal Matrix: Definition and Properties"
        },
        {
          "title": "If Statements",
          "subject": "Computing",
          "content": "Conditional Statements in Python: If Statements"
        }
      ]
    /*useEffect(() => {
        getRandomTopicsData()
            .then((response) => {
                setRandomTopicDatas(response)
                console.log(response)
            })
            .catch((error) => console.log(error))
    }, [])*/

    const [wavelength, setWavelength] = useState(100);
    const [amplitude, setAmplitude] = useState(50);
    const [frequency, setFrequency] = useState(0)
    const [phase, setPhase] = useState(0); // Phase to control the wave's horizontal shift
  
    const layerRef = useRef(null);
  
    // Function to create a sine wave with phase
    const createWave = (amplitude: number, wavelength: number, phase: number) => {
      const points = [];
      for (let x = 0; x < 500; x++) {
        const y = amplitude * Math.sin((x / wavelength) * 2 * Math.PI + phase); // Adding phase for animation
        points.push(x, 150 + y); // 150 to center the wave vertically
      }
      return points;
    };
  
    // Animation loop using Konva.Animation
    useEffect(() => {
      // @ts-expect-error it works i guess ?
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const anim = new window.Konva.Animation((frame: { time: number }) => {
        const time = frame.time / (1001-(frequency*10)); // Time in seconds
        setPhase(time * 2 * Math.PI); // Animate phase to move the wave (2π for full sine wave cycle)
        // Force the layer to redraw by calling batchDraw
        try {
            // @ts-expect-error it works i guess ?
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            layerRef.current.batchDraw();
        }
        catch (error) {
            console.error(error);
        }
      }, layerRef.current);
  
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      anim.start(); // Start the animation
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return () => anim.stop(); // Cleanup when the component unmounts
    }, [frequency]);

    const botProfilePictureUrl = "https://utfs.io/f/9686b7d0-c7a4-4e31-9eba-43e712d843be-ngnl8f.png"

    return (
        <div className="w-full h-fit homepage overflow-y-auto overflow-x-hidden flex flex-col md:block gap-32 md:gap-0">
            <div className="w-full h-screen flex items-center justify-center">
                <div className="flex flex-col gap-8">
                    <div className={`transition-all duration-300 ${exploreHover ? "opacity-25" : ""}`}>
                        <div className="text-6xl md:text-9xl font-bold">RccRevision</div>
                        <div className="flex flex-row gap-2 justify-between">
                            <div>An all in one Revision tool.</div>
                            <div className="opacity-50 hidden md:block">
                                <ReactTyped
                                strings={["Built by us, Made for you.", "Built by students, for students.", "Simplifying Success"]}
                                typeSpeed={40}
                                loop={true}
                                backSpeed={20}
                                backDelay={2000}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-4 justify-center">
                        <button className={`relative px-6 py-2 text-xl hover:border-transparent border flex-grow rounded-md text-white transition-all hover:rounded-[30px] duration-300 bg-[${theme.body}] hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]`} onMouseEnter={() => setExploreHover(true)} onMouseLeave={() => {setExploreHover(false)}} onClick={() => {
                            // @ts-expect-error it works kinda
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                            firstItem.current?.scrollIntoView({block: "end", behavior: "smooth"})
                        }}>
                            Explore
                        </button>

                        <SignedOut>
                            <SignInButton><button className={`px-4 py-2 text-md border rounded-md hover:shadow-md hover:px-8 hover:opacity-100 transition-all ${exploreHover ? "opacity-[0.125]" : "opacity-50"} duration-300`}>Sign in</button></SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </div>
            <div ref={firstItem} className="w-full min-h-screen flex flex-col md:flex-row items-center justify-center gap-16 p-4 md:p-0">
                <div className="w-full md:w-1/3 h-fit flex flex-col items-center gap-4">
                    <div className="p-6 rounded-md border shadow-md flex flex-col gap-2 w-full">
                        <div className="flex flex-row justify-between items-center">
                            <div className="text-md md:text-2xl font-bold">
                                <ReactTyped
                                    strings={randomTopicDatas.map((data) => data.title)}
                                    typeSpeed={40}
                                    loop={true}
                                    startWhenVisible
                                    backSpeed={20}
                                    backDelay={2000}
                                />
                            </div>
                            <div className={`p-1 px-4 text-xs md:text-sm bg-[${theme.sideNav}] rounded-full`}>
                                <ReactTyped
                                    strings={randomTopicDatas.map((data) => data.subject)}
                                    typeSpeed={40}
                                    loop={true}
                                    startWhenVisible
                                    backSpeed={20}
                                    backDelay={2000}
                                    showCursor={false}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-4 opacity-50">
                            <div className="flex flex-row gap-1 items-center">
                                <LuBookmark />
                                <div>Content</div>
                            </div>
                            <div className="flex flex-row gap-1 items-center">
                                <LuVideo />
                                <div>Video</div>
                            </div>
                            <div className="flex flex-row gap-1 items-center">
                                <LuMessageCircle />
                                <div>Ai</div>
                            </div>
                        </div>
                        <div></div>
                        <div></div>
                        <div className="opacity-50">
                                <ReactTyped
                                    strings={randomTopicDatas.map((data) => data.content)}
                                    typeSpeed={10}
                                    loop={true}
                                    startWhenVisible
                                    
                                    backSpeed={20}
                                    backDelay={2000}
                                />
                            {
                                
                            }
                        </div>
                    </div>
                    <Link href="/topics" className={`flex flex-row w-full p-2 items-center justify-center bg-[${theme.sideNav}] rounded-md hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all`}>
                        Explore Topics
                    </Link>
                </div>
                <div className="w-full md:w-1/3 h-fit flex flex-col gap-4">
                    <div className="text-4xl font-bold">Topics</div>
                    <div className="opacity-75">Dive into over 500 carefully curated topics covering most core GCSE subjects. Each topic comes with embedded videos for visual learning, plus key terms linked to quick, accessible definitions (similar to Wikipedia).</div>
                    <div className="opacity-75">Engage deeper with our built-in AI chatbot for each topic—ask questions, get explanations, and enhance your understanding (available for signed-in users). Track engagement with our topic views and global likes counters, while also building your personal library by liking topics. Your liked topics will appear in your profile for easy access.</div>
                    <div className="opacity-75">Want more? Head to the Topic Marketplace where you can create and share your own topics (sign-in required). Browse user-generated topics, and if one catches your eye, simply click "Add Topic" to integrate it into your learning dashboard.</div>
                    <div className="flex flex-row justify-end items-center gap-2">
                        <div>Continue for more.</div>
                        <LuCornerRightDown className="translate-y-1" />
                    </div>
                </div>
            </div>
            <div className="w-full min-h-screen flex flex-col-reverse md:flex-row items-center justify-center gap-16 p-4 md:p-0">
                <div className="w-full md:w-1/3 flex flex-col gap-4 h-fit">
                    <div className="text-4xl font-bold">Interactables</div>
                    <div className="opacity-75">Explore our innovative Interactables, designed to offer a deeper, more engaging way to grasp complex concepts. Currently in beta, this feature includes a growing collection of interactive tools that allow you to manipulate variables and observe how changes affect different systems.</div>
                    <div className="opacity-75">Whether you're exploring physics, chemistry, or other subjects, these interactables provide a hands-on approach to learning, helping you visualize and experiment with concepts in real-time.</div>
                    <div className="opacity-75">More interactables are being developed, so keep an eye out for new additions!</div>
                    <div className="flex flex-row items-center gap-2">
                        <LuCornerLeftDown className="translate-y-1" />
                        <div>Continue for more.</div>
                    </div>
                </div>
                <div className="flex flex-col md:w-fit w-full h-fit">
                    <div>
                        <div className="flex flex-row gap-2 items-center justify-between text-xl font-thin">
                            Wavelength:
                            <div className="w-2/3">
                                <Range
                                onChange={(values) => setWavelength(values[0]??0)}
                                values={[wavelength]} 
                                renderTrack={({ props, children }) => (
                                    <div
                                        {...props}
                                        style={{
                                        ...props.style,
                                        height: "6px",
                                        width: "100%",
                                        borderRadius: "50px",
                                        background: getTrackBackground({
                                            colors: ["white", "#ccc"],
                                            min: 0,
                                            max: 100,
                                            values: [wavelength]
                                        }),
                                        }}
                                    >
                                        {children}
                                    </div>
                                )}
                                renderThumb={({ props }) => (
                                    <div
                                    {...props}
                                    key={props.key}
                                    style={{
                                        ...props.style,
                                        height: "12px",
                                        width: "12px",
                                        borderRadius: "50%",
                                        border: "2px solid #ccc",
                                        backgroundColor: "white",
                                        outline: "none",
                                    }}
                                    />
                                )} />
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 items-center justify-between text-xl font-thin">
                            Amplitude:
                            <div className="w-2/3">
                                <Range
                                    onChange={(values) => setAmplitude(values[0]??0)}
                                    values={[amplitude]} 
                                    renderTrack={({ props, children }) => (
                                        <div
                                            {...props}
                                            style={{
                                            ...props.style,
                                            height: "6px",
                                            width: "100%",
                                            borderRadius: "50px",
                                            background: getTrackBackground({
                                                colors: ["white", "#ccc"],
                                                min: 0,
                                                max: 100,
                                                values: [amplitude]
                                            }),
                                            }}
                                        >
                                            {children}
                                        </div>
                                    )}
                                    renderThumb={({ props }) => (
                                        <div
                                        {...props}
                                        key={props.key}
                                        style={{
                                            ...props.style,
                                            height: "12px",
                                            width: "12px",
                                            borderRadius: "50%",
                                            border: "2px solid #ccc",
                                            backgroundColor: "white",
                                            outline: "none",
                                        }}
                                        />
                                    )} />
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 items-center justify-between text-xl font-thin">
                            Frequency:
                            <div className="w-2/3">
                                <Range
                                    onChange={(values) => setFrequency(values[0]??0)}
                                    values={[frequency]} 
                                    renderTrack={({ props, children }) => (
                                        <div
                                            {...props}
                                            style={{
                                            ...props.style,
                                            height: "6px",
                                            width: "100%",
                                            borderRadius: "50px",
                                            background: getTrackBackground({
                                                colors: ["white", "#ccc"],
                                                min: 0,
                                                max: 100,
                                                values: [frequency]
                                            }),
                                            }}
                                        >
                                            {children}
                                        </div>
                                    )}
                                    renderThumb={({ props }) => (
                                        <div
                                        {...props}
                                        key={props.key}
                                        style={{
                                            ...props.style,
                                            height: "12px",
                                            width: "12px",
                                            borderRadius: "50%",
                                            border: "2px solid #ccc",
                                            backgroundColor: "white",
                                            outline: "none",
                                        }}
                                        />
                                )} />
                            </div>
                        </div>
                    </div>
                    <Stage width={500} height={300}>
                        <Layer ref={layerRef}>
                        <Line
                            points={createWave(amplitude, wavelength, phase)}
                            stroke="white"
                            strokeWidth={2}
                            lineJoin="round"
                            tension={0.5}
                        />
                        </Layer>
                    </Stage>
                    <Link href="/interactables" className={`flex flex-row w-full p-2 items-center justify-center bg-[${theme.sideNav}] rounded-md hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all`}>
                        Explore Interactables
                    </Link>
                </div>
            </div>
            <div className="w-full min-h-screen flex flex-col md:flex-row items-center justify-center gap-16 p-4 md:p-0">
                <div className="flex flex-col w-full md:w-1/3 gap-12">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row gap-4 items-center">
                            <LuSparkles className="text-blue-500" size={36} />
                            <div className="text-3xl font-bold">Ai Chatbot</div>
                        </div>
                        <div className={`p-1 px-4 text-sm bg-[${theme.sideNav}] rounded-full`}>
                            <ReactTyped
                                strings={randomTopicDatas.map((data) => data.subject)}
                                typeSpeed={60}
                                loop={true}
                                startWhenVisible
                                backSpeed={30}
                                backDelay={5000}
                                showCursor={false}
                                shuffle={true}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 opacity-75">
                        {
                            [
                                {role: "user", text: `Can you explain the light-dependent reactions?`},
                                {role: "model", text: `The light-dependent reactions in photosynthesis occur in the thylakoid membranes of chloroplasts. Here's a brief overview:`},
                                {role: "model", text: `1. Light is absorbed by chlorophyll and other pigments. 2. This energy is used to split water molecules, releasing oxygen as a byproduct. 3. The energy is also used to produce ATP through photophosphorylation. 4. NADP+ is reduced to NADPH. These products (ATP and NADPH) are then used in the light-independent reactions (Calvin cycle) to produce glucose.`},
                                {role: "user", text: `What's the role of photosystem I and II in this process?`},
                                {role: "model", text: `...`},
                            ].map((textData, index) => (
                                textData.role == "model" ? (
                                    <div key={index} className="flex flex-row gap-2">
                                        <img src={botProfilePictureUrl} className="w-12 h-12 rounded-md object-cover p-1" alt="" />
                                        <div className="opacity-75 w-2/3">
                                            {textData.text}
                                        </div>
                                    </div>
                                ) : (
                                    <div key={index} className="flex flex-row gap-2 justify-end">
                                        <div className="opacity-75 w-2/3 text-right">
                                            {textData.text}
                                        </div>
                                        <img src={"https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ybDNJalRJcWN5UjdHTFJFMVIzWkRkdUhUOVMifQ"} className="w-12 h-12 rounded-md object-cover p-1" alt="" />
                                    </div>
                                )
                            ))
                        }
                    </div>
                    <Link href="/chatbot" className={`flex flex-row w-full p-2 items-center justify-center bg-[${theme.sideNav}] rounded-md hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all`}>
                        Explore our Chatbot
                    </Link>
                </div>
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <div className="text-4xl font-bold">Gemini</div>
                    <div className="opacity-75">Our advanced AI Chatbot, powered by Google's Gemini 1.5 Flash, is integrated into every topic for a personalized learning experience. Each chatbot is custom-built to understand and provide relevant information specific to the topic you're studying. Whether you're seeking clarification or deeper insights, the chatbot is there to assist.</div>
                    <div className="opacity-75">Conversations with the chatbot are saved individually per topic, allowing you to continue right where you left off. The main chatbot page also features its own memory for broader discussions. If needed, you can easily wipe the chat history to start fresh.</div>
                    <div className="opacity-75">Designed for seamless interaction, this AI is your study companion, always ready to help you master new concepts.</div>
                </div>
            </div>
            <div className="w-full min-h-screen flex flex-wrap p-4 md:p-32 gap-32">
                <div className="flex flex-col flex-grow md:w-1/4 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-4xl font-bold">Topics</div>
                        <div className="font-thin">Our Topics section offers over 500 subjects covering core GCSE material. Each topic includes embedded videos for enhanced learning, with key terms linked to definitions for quick reference. Signed-in users can interact with an AI chatbot customized for each topic, providing personalized support. Engagement is tracked with view and like counters, and liked topics are saved to user profiles for easy access.</div>
                    </div>
                    <Link href="/topics" className={`flex flex-row w-fit px-4 p-2 items-center justify-center bg-[${theme.sideNav}] rounded-md hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all`}>
                        Explore Topics
                    </Link>
                </div>
                <div className="flex flex-col flex-grow md:w-1/4 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-4xl font-bold">Interactables</div>
                        <div className="font-thin">Our Interactables feature provides a collection of interactive tools designed to enhance learning through real-time simulations. Users can adjust variables and see immediate effects, helping to visualize complex concepts. Currently in beta, with more interactables to come.</div>
                    </div>
                    <Link href="/interactables" className={`flex flex-row w-fit px-4 p-2 items-center justify-center bg-[${theme.sideNav}] rounded-md hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all`}>
                        Explore Interactables
                    </Link>
                </div>
                <div className="flex flex-col flex-grow md:w-1/4 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-4xl font-bold">Gemini</div>
                        <div className="font-thin">Our AI Chatbot, powered by Google Gemini 1.5 Flash, is integrated into every topic. It provides personalized support by understanding the specific subject matter, with individual memory for each topic, saving chats automatically. Users can clear chat history at any time, and the main chatbot page also retains memory for broader conversations.</div>
                    </div>
                    <Link href="/chatbot" className={`flex flex-row w-fit px-4 p-2 items-center justify-center bg-[${theme.sideNav}] rounded-md hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all`}>
                        Explore Our Chatbot
                    </Link>
                </div>
                <div className="flex flex-col flex-grow md:w-1/4 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-4xl font-bold">Search</div>
                        <div className="font-thin">Our Search page displays results based on user input and uses a fuzzy search system to handle partial or slightly inaccurate queries. It retrieves the closest matches to help users find relevant content efficiently.</div>
                    </div>
                    <Link href="/search" className={`flex flex-row w-fit px-4 p-2 items-center justify-center bg-[${theme.sideNav}] rounded-md hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all`}>
                        Explore Our Search
                    </Link>
                </div>
                <div className="flex flex-col flex-grow md:w-1/4 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-4xl font-bold">Topics Marketplace</div>
                        <div className="font-thin">Our Topics Marketplace allows signed-in users to create and share their own topics. User-generated topics are available for others to browse and add to their personal list. This feature enables customization and expands the range of available study materials beyond the standard topics.</div>
                    </div>
                    <Link href="/topic-marketplace" className={`flex flex-row w-fit px-4 p-2 items-center justify-center bg-[${theme.sideNav}] rounded-md hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all`}>
                        Explore Topic-Marketplace
                    </Link>
                </div>
                <div className="flex flex-col flex-grow md:w-1/4 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-4xl font-bold">Exam Practice</div>
                        <div className="font-thin">The Exam Practice section offers a collection of questions scraped from past papers. Users can navigate through these questions, create custom "playlists" by selecting specific papers, and shuffle the content for varied practice sessions. This feature allows for targeted revision and flexible study options.</div>
                    </div>
                    <Link href="/exam-practice" className={`flex flex-row w-fit px-4 p-2 items-center justify-center bg-[${theme.sideNav}] rounded-md hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all`}>
                        Explore Exam Practice
                    </Link>
                </div>
                <div className="flex flex-col flex-grow md:w-1/4 md:max-w-[25%] justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-4xl font-bold">Calendar</div>
                        <div className="font-thin">The Calendar feature retrieves and displays the most up-to-date calendar from the Robertsbridge Community College website. This provides users with current information on school events, deadlines, and activities.</div>
                    </div>
                    <Link href="/calendar" className={`flex flex-row w-fit px-4 p-2 items-center justify-center bg-[${theme.sideNav}] rounded-md hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all`}>
                        Explore Calendar
                    </Link>
                </div>
            </div>
            <div className="w-full h-96"></div>
        </div>
    )
}