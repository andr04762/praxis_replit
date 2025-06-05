import { Link } from "wouter";
import {
  HiAcademicCap as AcademicCapIcon,
  HiLightBulb as LightBulbIcon,
  HiRocketLaunch as RocketLaunchIcon,
  HiCurrencyDollar as CurrencyDollarIcon,
} from "react-icons/hi2";
import JesseImg from "@assets/Landing.Jesse.png";
import ConferenceImg from "@assets/Landing.Conferance.png";
import LoungeImg from "@assets/Landing.Lounge.png";
import WorkstationImg from "@assets/Landing.Workstation.png";
import { Check, X, Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function LandingPage() {
  const perks = [
    "Hands-on projects",
    "Expert mentors",
    "Job-ready skills",
  ];

  const difference = [
    { icon: AcademicCapIcon, text: "Real-world curriculum" },
    { icon: LightBulbIcon, text: "Interactive lessons" },
    { icon: RocketLaunchIcon, text: "Accelerated learning" },
    { icon: CurrencyDollarIcon, text: "Affordable pricing" },
  ];

  const products = [
    {
      title: "Workstation",
      image: WorkstationImg,
      text: "Set up a productive study space",
    },
    {
      title: "Conference",
      image: ConferenceImg,
      text: "Collaborate in virtual rooms",
    },
    {
      title: "Lounge",
      image: LoungeImg,
      text: "Learn comfortably anywhere",
    },
  ];

  const faq = [
    { q: "What is Praxis?", a: "Praxis offers project-based online courses." },
    { q: "How long are the programs?", a: "Most courses take 4-6 weeks to finish." },
    { q: "Do I need prior experience?", a: "No experience is required to start." },
    { q: "Is there career support?", a: "Yes, we help you showcase your skills." },
    { q: "Can I cancel anytime?", a: "You can cancel your subscription whenever." },
  ];

  const comparisons = [
    { label: "Price", praxis: true, dealer: false, fast: true },
    { label: "Customizable", praxis: true, dealer: true, fast: false },
    { label: "Fast Delivery", praxis: true, dealer: false, fast: true },
  ];

  const testimonials = [
    { name: "Jane Doe", role: "Data Analyst", quote: "Praxis made learning SQL a breeze!", rating: 5 },
    { name: "John Smith", role: "Engineer", quote: "The projects were practical and fun.", rating: 4 },
    { name: "Sam Lee", role: "Student", quote: "I landed a job thanks to Praxis.", rating: 5 },
  ];

  return (
    <div className="font-inter">
      {/* Hero Section */}
      <section className="bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Learning Made Easy</h1>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {perks.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <Button asChild className="mt-6">
              <Link to="/course">Start Now</Link>

            </Button>
          </div>
          <img
            src={JesseImg}
            alt="Praxis preview"
            className="w-full max-w-md rounded-lg shadow"
          />
        </div>
      </section>

      {/* Difference Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">The Praxis Difference</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {difference.map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center text-center gap-2">
                <Icon className="h-12 w-12 text-blue-600" />
                <p className="text-sm text-gray-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Highlights */}
      <section className="space-y-12">
        {products.map((p, i) => (
          <div
            key={p.title}
            className={`flex flex-col items-center md:items-stretch md:flex-row ${i % 2 === 1 ? 'md:flex-row-reverse' : ''} gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}
          >
            <img
              src={p.image}
              alt={`${p.title} image`}
              className="w-full md:w-1/2 rounded-lg shadow"
            />
            <div className="md:w-1/2 flex flex-col justify-center">
              <h3 className="text-2xl font-semibold mb-2">{p.title}</h3>
              <p className="text-gray-700 mb-4">{p.text}</p>
              <Button>Explore</Button>
            </div>
          </div>
        ))}
      </section>

      {/* Comparison Table */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">How We Compare</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Praxis</TableHead>
                <TableHead>High-End Dealer</TableHead>
                <TableHead>Fast Furniture</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisons.map((row) => (
                <TableRow key={row.label}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell>{row.praxis ? <Check className="text-green-600" /> : <X className="text-red-500" />}</TableCell>
                  <TableCell>{row.dealer ? <Check className="text-green-600" /> : <X className="text-red-500" />}</TableCell>
                  <TableCell>{row.fast ? <Check className="text-green-600" /> : <X className="text-red-500" />}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Testimonials</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="text-center">
                <CardHeader className="items-center">
                  <img
                    src={JesseImg}
                    alt={t.name}
                    className="rounded-full mb-2"
                  />
                  <CardTitle className="text-lg">{t.name}</CardTitle>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm">{t.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">FAQ</h2>
          <Accordion type="multiple" className="mx-auto max-w-2xl">
            {faq.map((item, idx) => (
              <AccordionItem key={item.q} value={`item-${idx}`}>
                <AccordionTrigger className="text-left" aria-expanded="false">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-amber-50 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to start learning with Praxis?</h2>
        <Button asChild>
          <Link to="/course">Join the Course</Link>
        </Button>
      </section>
    </div>
  );
}
