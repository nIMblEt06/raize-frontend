import React from "react";
import "./styles.scss";
import { LeagueCard } from "./LeagueCard";
import { SportBetCard } from "./SportsBetActionWidget";

const sportsEmojis = [
  "⚽️", // football (soccer)
  "🏀", // basketball
  "🎾", // tennis
  "🏏", // cricket
  "🏉", // rugby
  "🥊", // boxing
];

const footballLeagues = [
  {
    logo: "https://media-hosting.imagekit.io/b5b627c468084ac9/preml.jpg?Expires=1840989789&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=gCnHXJgPXwkrkn3f1gpdpR5OtEiA-La896eW2Wm61tPfWr8OSZsmaMPzNlUi4yrVnEGeOBF9eaqOOI1fVU8oPOnH0kLCtA95kO61eDSgadOInp0105BoqV7ZWtwlOaHnNIIDfHI2K9wd1mENWaFErIPjVFJSdCS55Vj95Wya98lZ4qFS0D-y0LN6YAsZDy2iIENrqs2B6UsWbNknbdbkFZ~xpqStGEMeWXXw99AzmEiV-JpUG53kI~kcxiTIodmbJnS2nwGu~sUre72ZOnXHnEi7X9B4zsPuLBiJIT~2b3IDkqrDcFO5JyN6goORarn-EES-1u9AWk128emwnZODoA__",
    name: "Premier League",
  },
  {
    logo: "https://media-hosting.imagekit.io/941e2892d1ef4117/laliga.webp?Expires=1840990074&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=wcpIGD5E9dnAeL87A18ZvvVY5JztrbI7yZ4pdiT-xWlhDfrW776ISvhbIFI6HftxDrL603TDeiXphaIaSR0Dzau0lC5mW5o00yZbeFCxNhxS7FmJ65EKvtjIrZwsGbtfskmeH6SvN0BnTiWZNZv0MoneBLoN6wGvSnOBIIgC0WEVTMuxZRgI5hBUkrMY1DhHVV4w1q1B3SXBfT77AomABWKfJEb2cDvanbaF59n2K1kQFEL6JiVyGahC~OflKI8Mmi5qCARri6yHcRUYKPNOCeHLxUfwgyzJQmIutVweiu-ifHft6SmExKFfNgQ83KHSDgyYWTV-KyHs949R7I4eFg__",
    name: "La Liga",
  },
  {
    logo: "https://media-hosting.imagekit.io/629794fa6887403b/seriea.jpg?Expires=1840990138&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=G~sL~Lfd2Hen4l2tZBE~lOdGq2LATOk5NzNtRqf2j0C72baNqqcSxiOILHlom-PfVOO71ArFD2G8Uuc99FeM~8a69IF8CW22HDq828HkEDK0u2mi6tsCGIVVEGjzkhCZiIUVbVrEyG0MOzup25i1zLChWTPIaBN8s4~4150x5CXByWpNbEQNDt3L1qk-mkkQemoqoXjTzlEGTxROmT3zaVUoBap24GsNNumXxjQrM~t~8U7emx2MUG6LsFvjrjKD5LeS3RSJwlP-NtXKU1L68f81nwWahEoryxxB~Vk7cQIVTuMkxN3MMutgySZGQnPCr-dPAYkyH7PUe4sIm69N6w__",
    name: "Serie A",
  },
  {
    logo: "https://media-hosting.imagekit.io/0dff5956eaff4daa/Ligue1.png?Expires=1840990192&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=CA5SpGiHpmuYASr~VsDKTnUwZKMN7gfVtUP3FMG2--mi~f-KFDBzR8pIH0CONOUSqpiZszEiCGcfN9pgcpEq3UotFEg4bvY74eSxk-tNdbrXH6635xTPmcDnhnxhLt9WBA0kSW0XgJt72xtyBHjj9EhRDP5W39qE1qqq61i4se-VTyTY6pIppTZlqcVyP5AnPQuXEY0Wgxu6oV~egQWYnlsHpYVphsqciM~AOIyUWLT0~IDWsyrc6jE01iOEmNBacGex2TpETU4v~b~iCed3xu4-rdmBenkNa-16ABGKRJ8qCF8KTEmx4lxrqEjiqhultorqmUdgMy0nUwX7ZxfSUQ__",
    name: "Ligue 1",
  },
  {
    logo: "https://media-hosting.imagekit.io/97bf7b1fda524f83/mls.jpg?Expires=1840990244&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=cPHp6AhiXZsh3Kyz2HVgpNQkqWo~xyhy0kRaefILtm8Z1by3h5CJcd23Agx~Ai0vT4zJc1ysp7VjxqXpb36PNlX69OYvi4274CyX~kTzpEWf9dEcIR6N877ImGsCqAFFcSE68etxHrYSLVxWonkrVjDT-KxS4wtPOwnLmAc3SLWwXbMX-rCz3XofVT0osm~AvUyQY7MP-WnpudrFXb4TtiUUaNmyImW6N41oLABG4EMLYZNQbPOwLBySEzKnzi5CUE-ek-YT5UJyUdjpCoE7acaerh1oconqhXPLyFx3Xk-ZTBywqHYI2L4PYeJ1NtH7lmeGZ5QQPvH-tcxK9y0RrA__",
    name: "MLS",
  },
];

const teamsData = [
  {
    teams: [
      {
        name: "San Martin de San Juan",
        logo: "https://media-hosting.imagekit.io/884cfa44bb5f4024/sanmartin.jpg?Expires=1840990692&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=yMPTCtw2mfDEXFZHAEEFarNI9QRTVm4QV9prKnG3n79ldA7zEVvHPpD8nWbstyTBiT~jpmFnrWzhhPk2ZOxsBix0d~cpbzYYLERNVbU716ZOkmO7Z6HgE8nDy5NRxgKhgE5LgIWknzMNrFH3a0lHaLwCUDPoLmJOUsDWYRt1sRDg5qPs8GpeXtojqoia8h-XC16GqdbCFl0pWqnYs5x0sJuwv9uf1QJa0PJ7yb59ujKk~w3grKf9n4sHgoM-2ghtTeFC5hGdqMe6WC3Uyds09sFNkbBhKXIQ3Skxuc7ZiWqlSgs9LOJvw9V7bVbcNMttO~W9HkYCnQ6PSGTRjVcQgQ__",
        price: 1.67,
      },
      {
        name: "CA Aldosivi",
        logo: "https://media-hosting.imagekit.io/18d3419a51cc4009/caa.jpeg?Expires=1840990758&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Gun-8AALvG78v6b4XCUDQG-34T7NitR3Xozn~4fdO7ogfVK0BTfDSqCWguWJdMEj5Hh1DfGCkCX~oOgp9qYSGAhhIoQqGA5eAQLChdGf3dQ4bKw~3Iw2zWDba7uiqaE~ZFZlQt23Z~UG5wEBo8D9~juvyyTyNy9FwdxLWooA93zibivE6hjo4BEX27ZkQHL8kjG3wQuBkjWowPZVKvdwWBwp0HiUVAkWR6ySwzk2NkTI61riV63fXSJjDPqzD0h2y1neJzBNfCnG6Y3DSY~RMLLaeF7B-~0qkvdpfNKapIdLaM~9~gcRSNvJi0V4yrmfKK-QovzZ36wsIwKWto0DCA__",
        price: 1.27,
      },
    ],
  },
  {
    teams: [
      {
        name: "New York City FC",
        logo: "https://media-hosting.imagekit.io/86a23e7210c04ed6/nyc.jpg?Expires=1840991185&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=MOX1YDZgyXxMDiuFM7aiaXHbxy5Mo2uaaDzYtXFf-Tk5Wx-K2M3U~Gz-ZIvAqgjdLSfjnWOkryjhQ-gA9Ux-sh3As6X8LmL7VrnccyOeuGc-oYNorrU-0wnWPpSEwuF4vtgEFH7lPwGfqgrudf1vWZUwKNMhY8vc3lq97RapHf1iNLi4FuqO5zoUF0HE8al4K5MbfUqp08VFd9snr4A5NDWhsanKxlVZoQRy8uDeRPEv-7bsHxo8ihbW6~q5vOaZ-Ls37ejmo2KDjzTNCCpzObOdd1KKBvlXSYywSoXN8BXTqmEzf6tSBO57Eh64PIQShHRZoKHkBHfphhMcdNBFPg__",
        price: 2.31,
      },
      {
        name: "FC Cincinnati",
        logo: "https://media-hosting.imagekit.io/dcb2be12d97e4363/fcc.jpeg?Expires=1840991261&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=yRtLqIjbQLFWUkAQx~jBHqPFXWEaEkw0KNiLozhCB-l2OSl6tJ4u8USHVS0F-3rDOCpEUC4r9t1FPTmneN9itL675yfGeCilTO2h7pHw8Il1N62KF9PWYntDydkkZxUYDZXRrVoUZGgoba1wd~-LiVaTXgRJ8-h0tXn2fx5JyXIyP224a9OdPE1IUNq0avBF3uJbx0WICr9oc~NUpVZtZc6LbE8nrCsrA48-tq-7A9XnkT7lfXO0WBXjnrDZBE0uGNRE9772ZBqBovrU0lLJDxnjfOc-GE0hnmuUCj1T3RVPrWhcghJxkf1TPa03aYSeenv9XUhobVnctBTRhB-~MA__",
        price: 2.83,
      },
    ],
  },
  {
    teams: [
      {
        name: "Real Sociedad",
        logo: "https://media-hosting.imagekit.io/af87e3c434bd43c9/rsd.png?Expires=1840991519&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=zlIKkHyOMSqXLIP5mNKnma3XPvc42S4pPrRSTZUdldg7ODKO8R21kpALuc5sSexMVdRc9yRouCvQSfBlprPBl-m14zav-r0Nmt1R-W2ZEUCMPlLiZ4yvJAxUUmT6ElAAy1rSHAz18g8t8EzEPChfKMVzGqFAGpJPYA2A0wnAGhYm8sBAMh3qDfhhaXJ1oWFDlT7JiVQBj4ZgUq305l3gVmKqC9WIIf4MkOhA3HwPWzlyHpC7YGIyNwilDxIzz8~l2kPI2roA1~CLAJxQkSYkhXZCsYMtwb9EClRlNO-09FIE~kXDLyJDOqZB13UQ478eNphG6Bv2KHuleM2bbdHXBw__",
        price: 1.12,
      },
      {
        name: "Athletic Bilbao",
        logo: "https://media-hosting.imagekit.io/2338c0719f4d43b0/atb.jpg?Expires=1840991589&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Ga8DteW5zN5PqbrGSzbK3a67b9c4Kw9BPnD9Pakl6MUcsPpt7nTZs5W3ZCa9Yv1g2FxELqAeUo2YRBznXHsBGwoVVpgyCSKFuFsG~-HC-EJfMr1DJfmSTSqC~gO~TQ0gXg32GzPDftHnFdrM04qinPKPY3LErV82Jbt5hfjwIPLwXLuUTRNC-GSmmjK68-dyrSv3DFvowgCfVEXeXVJ6c4jOMC-JEAH~83xlCLvktB14SBV29BaNOmF5oX6XKMuz1gEkPUmJ5~n2qE7GKkyat0zfMCTPoyCkDEIf3WkhLni00bUgdExNX4Dfb27N~8De0KgZW7NADlags0EhUhX4Ig__",
        price: 3.27,
      },
    ],
  },
  {
    teams: [
      {
        name: "Gremio RS",
        logo: "https://media-hosting.imagekit.io/214873fb47e442d6/grs.png?Expires=1840991641&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=IDWrLXPgFDBBATDs4N94fVBwiy5lE8qZWj9EzaKK-Pj4f64OoEhYLKcfBYO6HkqacQW8JGF1frg7F7WWxwdTsosF0J9sgjGtCAcgdbur6SlAgs52bGLrshxbj8Jg~TEHCbb2lPHh9x3IfuTUq10EcUHWFRH~ecSO4~XedolASsByIzMQQKg5ZsDyg8yRwsa65frlcxFmFdGYa4k8XsDrD8HW3D5ZJ9u-HEZt28Ba3UyjSgKLlRChFqYyIDhQ6n6UuR~0LuLBvH14SUHu5TIfx94G1yEdH4yvLZBgfRNI4kZ4GllPQot5zcHOHhwBw-oDS8eImz2ugw119F3HTdDCig__",
        price: 1.67,
      },
      {
        name: "Santos SP",
        logo: "https://media-hosting.imagekit.io/e66106f977fa4a39/ssfc.png?Expires=1840991678&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=rKXhfjZC2DNFXOMLjYHWq4qvPvoA~xkBexAgy4li8oLPIu8yiVb7zbiFs8B1N1eHz0WEB7gDgHQYLvoVS8f9wtjNWSJyPahLPvrFOJTHO38RLVdmXx8H7f~TVBSuqpmzfH~8ngn4VKSYxV82BXTbdPyMMApXPii9juV5An~hkWNBHzeDtrrKKSaBER4dW9DeV2wNnd~fGh62odfQROs5~Alxpx6ougq9mdNvVo1HO79Ucluvp5AHTv5pjRteqaMyUnzekuP1YSu6xro4wyTTIfMfhnBWvoha0uVncb-CFCxA-KB4A4oTqZBXMXB0WX6jYe-1oYdQRXD8RG2a01ltPw__",
        price: 2.14,
      },
    ],
  },
];

export const SportsBetWidget = () => {
  return (
    <div className="SportsBetContainer">
      <span className="Heading">Future of Sports Betting</span>
      <div className="SportsTypeContainer">
        {sportsEmojis.map((el, index) => (
          <div className="SportsType" key={index}>
            {el}
          </div>
        ))}
      </div>
      <div className="SportsBetSection">
        <div className="SportsBetLeaguesContainer">
          <div className="LeagueContainer">
            {footballLeagues.map((el, index) => (
              <LeagueCard {...el} key={index} />
            ))}
          </div>
        </div>
        <div className="SportsBetCardsContainer">
          {teamsData.map((el, index) => (
            <SportBetCard teams={el.teams} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
