# Job Opp Jarrar: Website Management Guide

Welcome to the management guide for your new overseas job hiring website. This document will walk you through everything you need to know to run the platform on a daily basis.

---

## 1. Accessing the Admin Panel

Your entire website is controlled from a hidden admin dashboard.
- **URL**: `https://your-domain.com/admin` (or `http://localhost:3000/admin` during development)
- **Password**: This is secured by the password you or your developer set in the environment variables (e.g., `ADMIN_PASSWORD`).

Once logged in, you will see your Dashboard with a quick overview of your total jobs, active jobs, and total clicks (the number of times users were redirected to apply).

---

## 2. Managing Jobs

The platform relies on the jobs you add to the system. 

### Adding a New Job
1. Go to the **Jobs** tab in your admin sidebar.
2. Click **Create New Job**.
3. Fill out the details:
   - **Title**: e.g., "Senior Software Engineer"
   - **Company**: e.g., "Google"
   - **Location**: e.g., "Dubai, UAE"
   - **Category**: Select the best fit (e.g., Tech, Healthcare, Construction).
   - **Job Type**: Full-Time, Part-Time, or Contract.
   - **Salary**: (Optional) e.g., "$5,000 - $8,000 / month".
   - **Description**: Add the full job details here.
   - **External URL**: **IMPORTANT!** This is the link to the actual application page (company website, WhatsApp link, Facebook group, etc.). When a user applies, they will be sent here.
4. Make sure **Active** is toggled ON.
5. Click **Save**. The job is now live on your site.

### Editing or Deleting a Job
1. Go to the **Jobs** tab.
2. Find the job in the list.
3. Click **Edit** to change its details or toggle it to "Inactive" if the position is filled but you want to keep the record.
4. Click **Delete** to permanently remove it from the system.

---

## 3. Managing Advertisements & Branding

This is how your site generates revenue. You monetize the traffic using ad scripts (like Google AdSense).

1. Go to the **Settings** tab in your admin sidebar.
2. **Branding**:
   - Update your **Site Name** and **Tagline** whenever you want. These changes reflect immediately across the site and in Google Search headers.
3. **Global Header Code**:
   - Paste your Google Analytics script or Google AdSense Auto-Ads script here. This script loads invisibly in the background on every page.
4. **Interstitial Ad Code**:
   - Paste a standard banner ad HTML block here (e.g., an AdSense display ad unit).
   - **Where it appears**: This ad will appear between the job listings on the homepage, on the mobile view of job details, and—most importantly—on the 5-second countdown redirect page right before a user goes to apply.
5. Click **Save Settings**.

---

## 4. How the User Journey Works (Monetization Flow)

1. A user lands on your site and browses the job listings.
2. They click "Details" on a job to read more. Ad slots are visible on the sidebar.
3. They click **Apply Now**.
4. Instead of going straight to the company, they hit the **Redirect Page**.
5. They wait for a **5-second countdown**. During this time, your main **Interstitial Ad** is displayed front and center.
6. After 5 seconds, they are automatically forwarded to the `External URL` you provided when creating the job.
7. Your admin dashboard records `+1 Click` so you can track which jobs are popular.

---

## 5. SEO and Showing up on Google

To make sure your website shows up on Google Searches:

1. **Submit your Sitemap**: 
   Go to [Google Search Console](https://search.google.com/search-console) and add your website property. Once verified, submit your sitemap URL: https://your-domain.com/sitemap.xml. This tells Google all the pages to scan.
2. **Google Jobs Integration**: 
   The site is already built with 'Structured Data' (JSON-LD) for Job Postings. As long as Google crawls your pages (which submitting the sitemap helps with), your listings will automatically appear in the special Google Jobs widget in search results.
3. **Analytics Tracking**: 
   Add your Google Analytics <script> tag into the Global Header Code section in the Settings panel to track how many users are visiting your site.
