use coba;

db.Mahasiswa.insert([{Kode_Mahasiswa :"M001",Nama_Mahasiswa : "Budi Gunawan",Alamat : "Jl. Mawar No 3 RT 05 Cicalengka, Bandung", Kode_Agama :"A001",Kode_Jurusan : "J001"},
{Kode_Mahasiswa :"M002",Nama_Mahasiswa : "Rinto Raharjo",Alamat : "Jl. Kebagusan No. 33 RT04 RW06 Bandung", Kode_Agama :"A002",Kode_Jurusan : "J002"},
{Kode_Mahasiswa :"M003",Nama_Mahasiswa : "Asep Saepudin",Alamat : "Jl. Sumatera No. 12 RT02 RW01, Ciamis", Kode_Agama :"A001",Kode_Jurusan : "J003"},
{Kode_Mahasiswa :"M004",Nama_Mahasiswa : "M. Hafif Isbullah",Alamat : "Jl. Jawa No 01 RT01 RW01, Jakarta Pusat", Kode_Agama :"A001",Kode_Jurusan : "J001"},
{Kode_Mahasiswa :"M005",Nama_Mahasiswa : "Cahyono",Alamat : "Jl. Niagara No. 54 RT01 RW09, Surabaya", Kode_Agama :"A003",Kode_Jurusan : "J002"}]);

db.Mahasiswa.find();

db.Ujian.insert([{Kode_Ujian : "U001" , Nama_Ujian : "Algoritma", Status_Ujian : "Aktif"},
{Kode_Ujian : "U002" , Nama_Ujian : "Aljabar", Status_Ujian : "Aktif"},
{Kode_Ujian : "U003" , Nama_Ujian : "Statistika", Status_Ujian : "Non Aktif"},
{Kode_Ujian : "U004" , Nama_Ujian : "Etika Profesi", Status_Ujian : "Non Aktif"},
{Kode_Ujian : "U005" , Nama_Ujian : "Bahasa Inggris", Status_Ujian : "Aktif"}]);

db.Ujian.find();

db.Agama.insert([{Kode_Agama : "A001", Deskripsi: "Islam"},
{Kode_Agama : "A002", Deskripsi : "Kristen"},
{Kode_Agama : "A003", Deskripsi : "Katolik"},
{Kode_Agama : "A004", Deskripsi : "Hindu"},
{Kode_Agama : "A005", Deskripsi : "Budha"}]);

db.Mahasiswa.aggregate([
	{ $lookup : { from : "Jurusan" , localField : "Kode_Jurusan", foreignField : "Kode_Jurusan", as : "Jurusan_Doc"}},
	{ $lookup : { from : "Agama", localField : "Kode_Agama" , foreignField : "Kode_Agama", as : "Agama_Doc"}},
	{ $match : {Kode_Mahasiswa : "M001"}},
	{ $unwind : "$Jurusan_Doc"},
	{ $unwind : "$Agama_Doc"},
	{ $project : {
	  "Kode_Mahasiswa" : "$Kode_Mahasiswa",
	  "Nama_Mahasiswa" : "$Nama_Mahasiswa",
	  "Nama_Jurusan" : "$Jurusan_Doc.Nama_Jurusan",
	  "Agama" : "$Agama_Doc.Deskripsi",
	  _id: 0
	}},
]);



db.Mahasiswa.aggregate([
	{ $lookup: { from: "Jurusan", localField: "Kode_Jurusan", foreignField: "Kode_Jurusan", as: "Jurusan_Doc"}},
	{ $match: { "Jurusan_Doc.Status_Jurusan": "Non Aktif" }},
	{ $unwind: "$Jurusan_Doc" },
	{ $project: 
		{ 
			Kode_Mahasiswa	: 1, 
			"Nama_Mahasiswa"	: "$Nama_Mahasiswa",
			"Kode_Jurusan"		: "$Kode_Jurusan",
			"Nama_Jurusan"		: "$Jurusan_Doc.Nama_Jurusan", 
			"Status_Jurusan"	: "$Jurusan_Doc.Status_Jurusan", 
			_id: 0
		}
	}
]);

db.Mahasiswa.aggregate([
	{ $lookup: { from: "Nilai", localField: "Kode_Mahasiswa", foreignField: "Kode_Mahasiswa", as: "Nilai_Doc"}},
	{ $lookup: { from: "Ujian", localField: "Nilai_Doc.Kode_Ujian", foreignField: "Kode_Ujian", as: "Ujian_Doc"}},
	{ $match: { "Ujian_Doc.Status_Ujian": "Aktif" }},
			  { "Nilai_Doc.Nilai" : { $gt: 80 },
	{ $unwind: "$Jurusan_Doc" },
	{ $unwind:	"$Ujian_Doc"},
	{ $project: 
		{ 
			"Kode_Mahasiswa"	: "$Kode_Mahasiswa", 
			"Nama_Mahasiswa"	: "$Nama_Mahasiswa",
			"Status_Ujian"		: "$Ujian_Doc.Status_Ujian"
		
			_id: 0
		}
	}
]);

db.Mahasiswa.aggregate([
	{ $lookup: { from: "Nilai", localField: "Kode_Mahasiswa", foreignField: "Kode_Mahasiswa", as: "Nilai_Doc"}},
	{ $lookup: { from: "Ujian", localField: "Nilai_Doc.Kode_Ujian", foreignField: "Kode_Ujian", as: "Ujian_Doc"}},
	{ $match: { "Ujian_Doc.Status_Ujian": "Aktif" 
				"Nilai_Doc.Nilai" : {gt:80} , 
	}
	{ $unwind: "$Jurusan_Doc" },
	{ $project: 
		{ 
			"Kode_Mahasiswa"	: "$Kode_Mahasiswa", 
			"Nama_Mahasiswa"	: "$Nama_Mahasiswa",
			"Kode_Jurusan"		: "$Kode_Jurusan",
			"Kode_Ujian"		: "$Ujian_Doc.Kode_Ujian",
			"Nama_Ujian"		: "$Ujian_Doc.Nama_Ujian", 
			"Status_Ujian"		: "$Ujian_Doc.Status_Ujian", 
			"Nilai"				: "$Nilai_Doc.Nilai"
			

			_id: 0
		}
	}
]);

/*
5	Buatlah query untuk menampilkan data mahasiswa dengan nilai diatas 80 untuk ujian dengan Status Ujian = Aktif
*/
db.Mahasiswa.aggregate([
	{ $lookup: { from: "Nilai", localField: "Kode_Mahasiswa", foreignField: "Kode_Mahasiswa", as: "Nilai_Doc"}},
	{ $lookup: { from: "Ujian", localField: "Nilai_Doc.Kode_Ujian", foreignField: "Kode_Ujian", as: "Ujian_Doc"}},
	{ $match: 
		{ 
			"Nilai_Doc.Nilai"		: { $gt: 80 },
			"Ujian_Doc.Status_Ujian": "Aktif"
		}
	},
	{ $unwind: "$Nilai_Doc" },
	{ $unwind: "$Ujian_Doc" },
	{ $project: 
		{ 
			"Kode_Mahasiswa"	: "$Kode_Mahasiswa", 
			"Nama_Mahasiswa"	: "$Nama_Mahasiswa",
			"Kode_Jurusan"		: "$Kode_Jurusan",
			"Kode_Ujian"		: "$Ujian_Doc.Kode_Ujian",
			"Nama_Ujian"		: "$Ujian_Doc.Nama_Ujian", 
			"Status_Ujian"		: "$Ujian_Doc.Status_Ujian", 
			_id: 0
		}
	}
]);

db.Jurusan.find({"Nama_Jurusan" : /Sistem/});

db.Mahasiswa.aggregate([
	{ $lookup: { from: "Nilai", localField: "Kode_Mahasiswa", foreignField: "Kode_Mahasiswa", as: "Nilai_Doc" }},
	{ $lookup: { from: "Ujian", localField: "Nilai_Doc.Kode_Ujian", foreignField: "Kode_Ujian", as: "Ujian_Doc" }},
	{ $project: 
		{ 
		  	Kode_Mahasiswa: "$Kode_Mahasiswa",
		  	Nama_Mahasiswa: 1,
		  	Alamat: 1,
		  	Kode_Jurusan: 1,
		  	Kode_Agama: 1,
			numOfUjian: { $size: "$Ujian_Doc" },
			_id: 0
		}
	},
	{ $match: { "numOfUjian": { $gt: 0 }}}
]);


	  
	  
	  






