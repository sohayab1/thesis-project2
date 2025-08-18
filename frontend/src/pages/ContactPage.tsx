import { Layout } from "@/components/layout/Layout";

export function ContactPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-8 max-w-3xl">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-3 text-gray-600">
            Reach out for support, reporting, or guidance. We are here to help people of Bangladesh
            stay safe online and respond quickly to cyber threats.
          </p>
        </header>

        {/* Contact Info */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Phone</h2>
            <p className="mt-2 text-gray-700 text-sm leading-relaxed">
              Main Helpline: <span className="font-medium">+880 1234-567890</span> <br />
              Emergency: <span className="font-medium">999</span>
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Email</h2>
            <p className="mt-2 text-gray-700 text-sm leading-relaxed">
              General Queries:{" "}
              <a href="mailto:support@cybercrimebd.org" className="underline">
                support@cybercrimebd.org
              </a>
              <br />
              Incident Reports:{" "}
              <a href="mailto:report@cybercrimebd.org" className="underline">
                report@cybercrimebd.org
              </a>
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Office</h2>
            <p className="mt-2 text-gray-700 text-sm leading-relaxed">
              Cybercrime Help Desk <br />
              Dhaka Metropolitan Police HQ <br />
              Ramna, Dhaka-1000, Bangladesh
            </p>
          </div>
        </section>

        {/* Google Map */}
        <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Find Us on Google Map</h2>
        <div className="rounded-2xl overflow-hidden border shadow-sm">
            <iframe
            title="Dhaka Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8925090448077!2d90.39124501543142!3d23.750930994616436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b894a313b6f5%3A0x61f9b2d8a5a8adf1!2sPolice%20Cyber%20Support%20for%20Women%20(DMP)!5e0!3m2!1sen!2sbd!4v1689777380000!5m2!1sen!2sbd"
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            ></iframe>
        </div>
        </section>

        {/* Important Links */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Important Websites & Links</h2>
          <ul className="list-disc pl-5 text-gray-700 text-sm space-y-2">
            <li>
              <a
                href="https://www.police.gov.bd/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Bangladesh Police Official Website
              </a>
            </li>
            <li>
              <a
                href="https://www.dmp.gov.bd/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Dhaka Metropolitan Police (DMP)
              </a>
            </li>
            <li>
              <a
                href="https://www.btrc.gov.bd/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Bangladesh Telecommunication Regulatory Commission (BTRC)
              </a>
            </li>
            <li>
              <a
                href="https://www.cirt.gov.bd/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Bangladesh e-Government Computer Incident Response Team (BGD e-Gov CIRT)
              </a>
            </li>
            <li>
              <a
                href="https://www.digitalsecurity.gov.bd/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                National Digital Security Agency
              </a>
            </li>
          </ul>
        </section>

        {/* Emergency Numbers */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Emergency Numbers in Bangladesh</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold">Police</h3>
              <p className="text-gray-700 text-sm mt-1">999 (National Emergency Service)</p>
            </div>
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold">Cyber Help Desk</h3>
              <p className="text-gray-700 text-sm mt-1">+880 1799-999999 (example)</p>
            </div>
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold">Fire Service</h3>
              <p className="text-gray-700 text-sm mt-1">199</p>
            </div>
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="font-semibold">Ambulance</h3>
              <p className="text-gray-700 text-sm mt-1">+880 1711-111111 (example)</p>
            </div>
          </div>
        </section>

        {/* Safety Reminder */}
        <section className="mt-12 rounded-2xl border bg-gray-50 p-6">
          <h2 className="text-xl font-semibold">Stay Safe Online</h2>
          <p className="mt-2 text-gray-700 text-sm leading-relaxed">
            When contacting us, please provide clear details but never share your OTP, PIN, or bank
            passwords. Our team and official authorities will never ask for sensitive credentials.
          </p>
        </section>
      </div>
    </Layout>
  );
}
