/* ==========================================================================
   Client testimonials, shown on the home page (section "In their words").

   REAL, and supplied by Stefan on 21 and 22 September 2026: three private
   supply clients he asked directly, forwarded to us by email. Each client was
   told the words would go up ANONYMOUSLY, credited only to a private water
   supply near a named place. So there are no names here, ever, unless a client
   later agrees to be named. `place` is the only identifying detail.

   Edits to the clients' own words are limited to typos: "bore hole" is set as
   "borehole", and "replace and rebuilt" as "replace and rebuild". Nothing else
   has been reworded. The one structural edit: the featured quote's `pull`
   sentence is lifted out of its closing paragraph rather than printed twice.
   No em dashes.

   `feature: true` marks the one that takes the large card. It is the longest
   and the most specific, so it earns the room; `pull` is a sentence lifted
   verbatim from its own text and set large above the rest. Only one entry
   should carry it. `quote` is an array of paragraphs.
   ========================================================================== */

module.exports = [
  {
    feature: true,
    place: "Elstead, Surrey",
    scope: "Borehole to tap redesign, servicing and testing",
    pull: "Stefan is one of those rare people who genuinely cares about doing a job properly.",
    quote: [
      "We have been hugely impressed with Stefan and Invicta Water Treatment. Stefan has completely redesigned and upgraded our water system, from the borehole pump right through to the taps in our home. He also takes care of the ongoing servicing and water quality testing, so we have complete confidence in both the system and the quality of our water.",
      "What really stands out is Stefan’s knowledge, care and responsiveness. When our borehole pump finally failed after 10 years, he was incredibly quick to respond and get us back up and running. Rather than simply replacing the failed pump, he took the opportunity to improve the original design, making the system more robust and significantly reducing the likelihood of the same problem happening again.",
      "He is knowledgeable, reliable, responsive and a pleasure to deal with. We really couldn’t recommend Stefan and Invicta Water Treatment highly enough.",
    ],
  },
  {
    place: "Woking, Surrey",
    scope: "Failed borehole system, replaced and rebuilt",
    quote: [
      "I just want to thank you for the work done on our water system. We originally had a borehole set up through another supplier. After a few months we found this system continually breaking down with poor water quality and contamination issues.",
      "Thankfully we contacted you to completely replace and rebuild the system. I am pleased to say it is now working perfectly and we are very happy to recommend you for your professionalism and attention to detail.",
    ],
  },
  {
    place: "Effingham, Surrey",
    scope: "Complex requirements, and ongoing servicing",
    quote: [
      "Stefan and Invicta Water Treatment have done an outstanding job in resolving our more complex water requirements and subsequent servicing needs. Always responsive, thoroughly professional and a pleasure to work with.",
    ],
  },
];
